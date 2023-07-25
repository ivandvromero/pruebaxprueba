import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { Repository } from 'typeorm';
import { Logger } from '@dale/logger-nestjs';
import { config } from '../../../shared/config/typeorm.config';
import { SessionTimeEntity } from './session-time.entity';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { BadRequestException } from '@dale/exceptions/custom-errors/custom-exception';
import { UpdateSessionTimeDto } from '../..';
import { RoleEntity } from '@dale/roles/repositories';

@Injectable()
export class SessionTimeRepository implements OnModuleInit {
  private sessionTimeDB: Repository<SessionTimeEntity>;
  constructor(private dbService: DatabaseService, private logger: Logger) {}
  async onModuleInit() {
    await this.dbService.init(config, process.env.TYPEORM_BACKOFFICE_USERNAME);
    this.sessionTimeDB = this.dbService.getRepository(SessionTimeEntity);

    if (process.env.DB_ROTATING_KEY === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          process.env.TYPEORM_BACKOFFICE_DATABASE,
        );
        this.sessionTimeDB = this.dbService.getRepository(SessionTimeEntity);
      }, Number(process.env.DB_CONNECTION_REFRESH_MINUTES) * 60 * 1000);
    }
  }

  async isDbConnectionAlive(): Promise<boolean | string> {
    return this.dbService.isDbConnectionAlive();
  }

  async getSessionTime(role: RoleEntity): Promise<SessionTimeEntity> {
    this.logger.debug('Get session time repository method started');
    try {
      const roleAux = { id: role.id, name: role.name };
      const timeEntity = await this.sessionTimeDB.findOne({
        where: { role: roleAux },
      });
      return timeEntity;
    } catch (error) {
      this.logger.error(error?.message);
      throw new BadRequestException(
        ErrorCodesEnum.BOS037,
        'Error al consultar el tiempo de sesión el ajuste monetario.',
      );
    }
  }

  async getAllSessionTime(): Promise<SessionTimeEntity[]> {
    this.logger.debug('Get all session time repository method started');
    try {
      return await this.sessionTimeDB.find({
        relations: { role: true },
      });
    } catch (error) {
      this.logger.error(error?.message);
      throw new BadRequestException(
        ErrorCodesEnum.BOS037,
        'Error al consultar el tiempo de sesión el ajuste monetario.',
      );
    }
  }

  async createSessionTime(
    sessionTimeEntity: SessionTimeEntity,
  ): Promise<SessionTimeEntity> {
    this.logger.debug('Create session time repository method started');
    try {
      const createdSessionTime = await this.sessionTimeDB.create(
        sessionTimeEntity,
      );
      return await this.sessionTimeDB.save(createdSessionTime);
    } catch (error) {
      this.logger.error(error?.message);
      throw new BadRequestException(
        ErrorCodesEnum.BOS038,
        'Error al crear el tiempo de sesión.',
      );
    }
  }

  async updateSessionTime(
    updateSessionTimeDto: UpdateSessionTimeDto,
  ): Promise<SessionTimeEntity> {
    this.logger.debug('Update session time repository method started');
    try {
      const { id, sessionTime } = updateSessionTimeDto;
      await this.sessionTimeDB.update(id, { sessionTime });
      return await this.sessionTimeDB.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(error?.message);
      throw new BadRequestException(
        ErrorCodesEnum.BOS040,
        'Error al actualizar el tiempo de sesión.',
      );
    }
  }
}
