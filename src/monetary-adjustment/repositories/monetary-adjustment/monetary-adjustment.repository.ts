import { OnModuleInit, Injectable } from '@nestjs/common';
import { Between, ILike, In, IsNull, Repository } from 'typeorm';
import { Logger } from '@dale/logger-nestjs';
import { AdjustmentQueryDto } from '../../modules/monetary-adjustment/dto/get-adjustment-query.dto';
import { PaginationAdjustmentsResponse } from '../../shared/common/get-adjustments-response';
import { AdjustmentState } from '../../shared/enums/adjustment-state.enum';
import { MonetaryAdjustmentEntity } from '../../shared/interfaces/monetary-adjustment.entity';
import { ResponseInterface } from '../../shared/interfaces/response-interface';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { MonetaryAdjustmentEntityOrm } from './monetary-adjustment.entity';
import { config } from '../../../shared/config/typeorm.config';
import { UpdateAdjustmentRegister } from '../activity-update/update-adjustment-register.entity';
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from '@dale/exceptions//custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions//code-errors/error-codes.enum';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { CreateNotificationSingleAdjustment } from '@dale/notifications/shared/common/create-notification-single-adjustment';
import { DateToUpdateEnum } from '@dale/notifications/shared/enums/date-to-update.enum';
import { CreateNotificationService } from '@dale/notifications/services/create-notification.service';
import { UpdateNotificationWithoutIdService } from '@dale/notifications/services/update-notification-date-without-id.service';

@Injectable()
export class MonetaryAdjustmentRepository implements OnModuleInit {
  private monetaryAdjustmentDB: Repository<MonetaryAdjustmentEntityOrm>;
  private adjustmentRegisterDB: Repository<UpdateAdjustmentRegister>;
  constructor(
    private dbService: DatabaseService,
    private createNotificationService: CreateNotificationService,
    private updateNotificationService: UpdateNotificationWithoutIdService,
    private logger: Logger,
  ) {}

  async onModuleInit() {
    await this.dbService.init(config, process.env.TYPEORM_BACKOFFICE_USERNAME);
    this.monetaryAdjustmentDB = this.dbService.getRepository(
      MonetaryAdjustmentEntityOrm,
    );
    this.adjustmentRegisterDB = this.dbService.getRepository(
      UpdateAdjustmentRegister,
    );
    if (process.env.DB_ROTATING_KEY === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          process.env.TYPEORM_BACKOFFICE_DATABASE,
        );
        this.monetaryAdjustmentDB = this.dbService.getRepository(
          MonetaryAdjustmentEntityOrm,
        );
        this.adjustmentRegisterDB = this.dbService.getRepository(
          UpdateAdjustmentRegister,
        );
      }, Number(process.env.DB_CONNECTION_REFRESH_MINUTES) * 60 * 1000);
    }
  }

  async isDbConnectionAlive(): Promise<boolean | string> {
    return this.dbService.isDbConnectionAlive();
  }

  async createAdjustment(
    adjustmentMetadata: UserInfoInterface,
    monetaryAdjustment: MonetaryAdjustmentEntity,
  ): Promise<MonetaryAdjustmentEntity> {
    const { amount, validateAmount } = monetaryAdjustment;
    if (amount !== validateAmount)
      throw new BadRequestException(
        ErrorCodesEnum.BOS003,
        'El monto y la confirmación del monto deben ser iguales.',
      );
    this.logger.debug('createAdjustment.repository started');
    try {
      const { name, email } = adjustmentMetadata;
      const updateRegister: UpdateAdjustmentRegister = {
        user: [name],
        userEmail: [email],
        updatedAt: [new Date()],
      };
      monetaryAdjustment.createdAt = new Date();
      await this.adjustmentRegisterDB.save(updateRegister);
      const createAdjustment =
        this.monetaryAdjustmentDB.create(monetaryAdjustment);
      const savedAdjustment = await this.monetaryAdjustmentDB.save({
        ...createAdjustment,
        updateRegister,
      });
      this.logger.debug(
        'createAdjustment.repository saving an adjustment with id: ' +
          savedAdjustment.id,
      );
      this.createNotificationService.run(
        new CreateNotificationSingleAdjustment(
          savedAdjustment,
          adjustmentMetadata,
        ),
      );
      return createAdjustment;
    } catch (error) {
      this.logger.error(error);
      this.handleDBExceptions(error);
    }
  }

  async findAll(
    adjustmentMetadata: UserInfoInterface,
    adjustmentQueryDto: AdjustmentQueryDto,
    counter?: boolean,
  ): Promise<PaginationAdjustmentsResponse> {
    const { limit = 0, offset = 0 } = adjustmentQueryDto;
    const { transactionLevel, codes, email } = adjustmentMetadata;
    try {
      this.logger.debug('findAll.repository initialized');
      let searchParams = {};
      let where;
      if (transactionLevel === 0) {
        where = {
          isFromFile: false,
          transactionCode: In(codes),
          updateRegister: {
            userEmail: ILike(`%${email}%`),
          },
        };
      }
      if (transactionLevel !== 0) {
        searchParams = {
          transactionLevel: transactionLevel,
          adjustmentState: AdjustmentState.PENDING,
          isFromFile: false,
          assignedTo: IsNull(),
          transactionCode: In(codes),
        };
        where = [searchParams, { ...searchParams, assignedTo: email }];
      }
      const monetaryAdjustments = await this.monetaryAdjustmentDB.find({
        where,
        order: {
          createdAt: 'ASC',
        },
        relations: { updateRegister: true },
        skip: offset * limit,
        take: limit,
      });
      const count = await this.monetaryAdjustmentDB.count({
        where,
      });

      if (!counter) {
        monetaryAdjustments.forEach((adjustment) =>
          this.updateNotificationService.run(
            adjustment.id,
            email,
            DateToUpdateEnum.VIEWED_AT,
          ),
        );
      }
      this.logger.debug('findAll.repository notifications updated');
      const response = new PaginationAdjustmentsResponse(
        monetaryAdjustments,
        limit,
        offset,
        count,
      );
      this.logger.debug('findAll.repository end');
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(
        ErrorCodesEnum.BOS004,
        'Error al intentar obtener los ajustes monetarios.',
      );
    }
  }

  async updateAdjustmentRegister(
    monetaryAdjustmentId: string,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<boolean> {
    const { name, email } = adjustmentMetadata;
    const adjustment = await this.monetaryAdjustmentDB.findOneOrFail({
      where: {
        id: monetaryAdjustmentId,
      },
      relations: { updateRegister: true },
    });
    const { updateRegister } = adjustment;
    const { id, user, userEmail, updatedAt } = updateRegister;
    user.push(name);
    userEmail.push(email);
    updatedAt.push(new Date());
    await this.adjustmentRegisterDB.update(
      {
        id,
      },
      {
        user,
        userEmail,
        updatedAt,
      },
    );
    return true;
  }

  async findAllHistoric() {
    return await this.monetaryAdjustmentDB.find({
      relations: { updateRegister: true },
    });
  }

  async patchTransactionLevel(
    adjustmentId: string,
    newTransactionLevel: number,
    adjustmentMetadata: UserInfoInterface,
    assignedTo?: string,
  ): Promise<string> {
    try {
      const { email } = adjustmentMetadata;
      await this.monetaryAdjustmentDB.update(
        {
          id: adjustmentId,
        },
        {
          transactionLevel: newTransactionLevel,
          updatedAt: new Date(),
          assignedTo,
        },
      );
      await this.updateAdjustmentRegister(adjustmentId, adjustmentMetadata);
      const adjustment = await this.findAdjustmentById(adjustmentId);
      if (assignedTo) {
        this.createNotificationService.run(
          new CreateNotificationSingleAdjustment(
            adjustment,
            adjustmentMetadata,
          ),
        );
        this.updateNotificationService.run(
          adjustmentId,
          email,
          DateToUpdateEnum.ATTENDED_AT,
        );
      }
      return `Pass to next level ${newTransactionLevel}`;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        ErrorCodesEnum.BOS006,
        'Error al intentar actualizar el nivel del ajuste monetario.',
      );
    }
  }

  async patchAdjustmentState(
    adjustmentId: string,
    newAdjustmentState: AdjustmentState,
    adjustmentMetadata?: UserInfoInterface,
    comment?: string,
  ): Promise<ResponseInterface> {
    try {
      await this.monetaryAdjustmentDB.update(
        {
          id: adjustmentId,
        },
        {
          adjustmentState: newAdjustmentState,
          comment,
          updatedAt: new Date(),
        },
      );
      const { name, email } = adjustmentMetadata;
      if (name) {
        await this.updateAdjustmentRegister(adjustmentId, adjustmentMetadata);
      }
      const adjustment = await this.monetaryAdjustmentDB.findOne({
        where: {
          id: adjustmentId,
        },
        relations: { updateRegister: true },
      });
      await this.createNotificationService.run(
        new CreateNotificationSingleAdjustment(
          adjustment,
          adjustmentMetadata,
          newAdjustmentState,
          adjustment.updateRegister.userEmail[0],
        ),
      );
      await this.updateNotificationService.run(
        adjustmentId,
        email,
        DateToUpdateEnum.ATTENDED_AT,
      );
      return {
        result: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        ErrorCodesEnum.BOS006,
        'Error al intentar actualizar el estado del ajuste monetario.',
      );
    }
  }

  async findAdjustmentById(
    adjustmentId: string,
  ): Promise<MonetaryAdjustmentEntity> {
    try {
      return await this.monetaryAdjustmentDB.findOneOrFail({
        where: {
          id: adjustmentId,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        ErrorCodesEnum.BOS002,
        'El ajuste monetario no fue encontrado.',
      );
    }
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    if (error.code == '23502') {
      throw new BadRequestException(
        ErrorCodesEnum.BOS003,
        'Error al crear el ajuste monetario.',
      );
    }
    throw new InternalServerException(
      ErrorCodesEnum.BOS008,
      'Error inesperado, por favor revisar los logs del servidor.',
    );
  }

  async countAccepted(
    initialDate: Date,
    endDate: Date,
    codes: string[],
  ): Promise<number> {
    return this.monetaryAdjustmentDB.count({
      where: {
        transactionCode: In(codes),
        adjustmentState: AdjustmentState.ACCEPTED,
        createdAt: Between(initialDate, endDate),
      },
    });
  }

  async countFailed(
    initialDate: Date,
    endDate: Date,
    codes: string[],
  ): Promise<number> {
    return this.monetaryAdjustmentDB.count({
      where: {
        transactionCode: In(codes),
        adjustmentState: AdjustmentState.REJECTED,
        createdAt: Between(initialDate, endDate),
      },
    });
  }
}
