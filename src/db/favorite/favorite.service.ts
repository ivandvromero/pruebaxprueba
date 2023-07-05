import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { config } from '../../config/user.orm.config';
import { DatabaseService } from '../connection/connection.service';

import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import serviceConfiguration from '../../config/service-configuration';
import {
  CreateFavoriteDto,
  ResultFavorite,
} from '../../modules/user-favorite/dto/create-favorite.dto';
import { HeaderDTO } from '../../shared/dto/header.dto';
import { EventLogService } from '../../shared/event-log/event-log-service';
import { BadRequestExceptionDale } from '@dale/manage-errors-nestjs';

@Injectable()
export class FavoriteDbService implements OnModuleInit {
  private favoriteRepository: Repository<Favorite>;
  constructor(
    private dbService: DatabaseService,
    private eventLogService: EventLogService,
  ) {}

  async onModuleInit() {
    this.favoriteRepository = this.dbService.getRepository(Favorite);
    if (serviceConfiguration().database.db_rotating_key === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          serviceConfiguration().database.typeorm_user_database,
        );
        this.favoriteRepository = this.dbService.getRepository(Favorite);
      }, Number(serviceConfiguration().database.db_connection_refresh_minutes) * 60 * 1000);
    }
  }

  async createFavorite(
    id: string,
    userFavorite: CreateFavoriteDto,
    headers: HeaderDTO,
  ): Promise<Favorite> {
    const resultCreateFavorite: ResultFavorite = {
      code: '0',
      message: '',
      action: 'CREATED',
    };
    try {
      const result = await this.favoriteRepository.findOne({
        where: {
          userId: userFavorite.userId,
          favoriteAlias: userFavorite.favoriteAlias,
          phoneNumber: userFavorite.phoneNumber,
        },
      });
      if (result) {
        return result;
      }

      return await this.favoriteRepository.save({
        id,
        ...userFavorite,
      });
    } catch (error) {
      resultCreateFavorite.code = ErrorCodesEnum.MUS000;
      resultCreateFavorite.message = 'Error creando contacto favorito';
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    } finally {
      await this.eventLogService.sendDebitTransferSQS(
        userFavorite,
        headers,
        resultCreateFavorite,
      );
    }
  }

  async findFavoriteByUserId(
    userId: string,
    filter: string,
    limit: number,
    offset: number,
  ): Promise<Favorite[]> {
    try {
      return await this.favoriteRepository.query(`
    (SELECT "Favorite"."id", "Favorite"."user_id" AS "userId", "Favorite"."favorite_alias" AS "favoriteAlias",
    "Favorite"."phone_number" AS "phoneNumber"
    FROM "favorites"  "Favorite"
    WHERE ("Favorite"."user_id" = '${userId}')
    AND "Favorite"."favorite_alias" ILIKE '%${filter}%')
    UNION
    (SELECT "Favorite"."id", "Favorite"."user_id" AS "userId", "Favorite"."favorite_alias" AS "favoriteAlias",
    "Favorite"."phone_number" AS "phoneNumber"
    FROM "favorites"  "Favorite"
    WHERE ("Favorite"."user_id" = '${userId}')
    AND "Favorite"."phone_number" ILIKE '%${filter}%')
    ORDER BY "favoriteAlias" ASC
    LIMIT ${limit} OFFSET ${offset}`);
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  async deleteFavoriteById(
    favoriteId: string,
    userId: string,
    headers: HeaderDTO,
  ): Promise<any> {
    const resultDeleteFavorite: ResultFavorite = {
      code: '0',
      message: '',
      action: 'REMOVED',
    };
    let favoriteUserDeleted: CreateFavoriteDto;
    try {
      const favoriteExist = await this.favoriteRepository.findOne({
        where: {
          id: favoriteId,
          userId: userId,
        },
      });
      let response;
      let message;
      if (favoriteExist) {
        favoriteUserDeleted = {
          favoriteAlias: favoriteExist.favoriteAlias,
          phoneNumber: favoriteExist.phoneNumber,
          userId: favoriteExist.userId,
          clientId: headers.ClientId,
          clientIdType: headers.ClientIdType,
          originCellphone: headers.OriginCellphone,
        };
        response = await this.favoriteRepository.delete(favoriteExist);
      } else {
        throw new BadRequestExceptionDale(ErrorCodesEnum.MUS006, {});
      }
      if (response?.affected && response.affected > 0) {
        message = {
          error: null,
          data: {
            code: ErrorCodesEnum.MUS008,
            message: 'Hemos eliminado este contacto de tus favoritos.',
          },
        };
      }
      return message;
    } catch (error) {
      resultDeleteFavorite.code = ErrorCodesEnum.MUS000;
      resultDeleteFavorite.message = 'Error eliminando contacto favorito';
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    } finally {
      if (favoriteUserDeleted?.favoriteAlias) {
        await this.eventLogService.sendDebitTransferSQS(
          favoriteUserDeleted,
          headers,
          resultDeleteFavorite,
        );
      }
    }
  }
}
