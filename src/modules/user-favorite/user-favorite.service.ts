import { EntityDoesNotExistException } from '@dale/shared-nestjs/custom-errors/custom-exception';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Favorite } from '../../db/favorite/favorite.entity';
import { FavoriteDbService } from '../../db/favorite/favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';

import { HeaderDTO } from '../../shared/dto/header.dto';
import { BadRequestExceptionDale } from '@dale/manage-errors-nestjs';

@Injectable()
export class UserFavoritesService {
  constructor(private favoriteDbService: FavoriteDbService) {}

  async create(
    createFavoriteDto: CreateFavoriteDto,
    headers: HeaderDTO,
  ): Promise<Favorite> {
    try {
      const id = uuidv4();
      return await this.favoriteDbService.createFavorite(
        id,
        createFavoriteDto,
        headers,
      );
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }
  async findAllByUserId(
    userId: string,
    filter: string,
    limit: number,
    offset: number,
  ): Promise<Favorite[]> {
    try {
      const result = await this.favoriteDbService.findFavoriteByUserId(
        userId,
        filter,
        limit,
        offset,
      );
      if (!result) {
        throw new EntityDoesNotExistException([]);
      }
      return result;
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  async remove(
    favoriteId: string,
    userId: string,
    headers: HeaderDTO,
  ): Promise<void> {
    return await this.favoriteDbService.deleteFavoriteById(
      favoriteId,
      userId,
      headers,
    );
  }
}
