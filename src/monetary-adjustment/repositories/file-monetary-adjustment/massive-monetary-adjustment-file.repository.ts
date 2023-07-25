import { Injectable, OnModuleInit } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Logger } from '@dale/logger-nestjs';
import { MassiveMonetaryAdjustmentFileDto } from '../../modules/monetary-adjustment/dto/massive-monetary-adjustment-file.dto';
import { FileMassiveMonetaryAdjustmentMapper } from '../../shared/common/file-adjustments-mapper';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { config } from '../../../shared/config/typeorm.config';
import { FileMassiveMonetaryAdjustment } from './massive-monetary-adjustment-file.entity';
import { AdjustmentQueryDto } from '../../modules/monetary-adjustment/dto/get-adjustment-query.dto';
import { PaginationMassiveAdjustmentsResponse } from '../../shared/common/get-massive-files-response';
import { AdjustmentState } from '../../shared/enums/adjustment-state.enum';
import { MonetaryAdjustmentEntityOrm } from '../monetary-adjustment/monetary-adjustment.entity';
import { MassiveAdjustmentUpdater } from '../../shared/common/massive-adjustments-updater';
import { ResponseInterface } from '../../shared/interfaces/response-interface';
import { UpdateAdjustmentRegister } from '../activity-update/update-adjustment-register.entity';
import { fileAdjustmentsMapperInstanced } from '../../shared/common/file-adjustments-mapper-instanced';
import { TransactionCodeService } from '../../../transaction-codes/services/transaction-codes.service';
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions//code-errors/error-codes.enum';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { UpdateSingleAdjustmentsResponse } from '@dale/monetary-adjustment/shared/interfaces/update-single-adjustments-response.interface';
import { FindNextUserMassiveMonetaryAdjustmentService } from '@dale/monetary-adjustment/modules/monetary-adjustment/service/find-next-user-massive-monetary-adjustment.service';
import { CreateNotificationMassiveAdjustment } from '@dale/notifications/shared/common/create-notification-massive-adjustments';
import { DateToUpdateEnum } from '@dale/notifications/shared/enums/date-to-update.enum';
import { CreateNotificationService } from '@dale/notifications/services/create-notification.service';
import { UpdateNotificationWithoutIdService } from '@dale/notifications/services/update-notification-date-without-id.service';

@Injectable()
export class MassiveMonetaryAdjustmentFileRepository implements OnModuleInit {
  private massiveMonetaryAdjustmentFileDB: Repository<FileMassiveMonetaryAdjustment>;
  private monetaryAdjustmentsDB: Repository<MonetaryAdjustmentEntityOrm>;
  private adjustmentRegisterDB: Repository<UpdateAdjustmentRegister>;
  constructor(
    private dbService: DatabaseService,
    private logger: Logger,
    private readonly transactionCodeService: TransactionCodeService,
    private readonly findNextUserMassiveService: FindNextUserMassiveMonetaryAdjustmentService,
    private readonly createNotificationService: CreateNotificationService,
    private readonly updateNotificationService: UpdateNotificationWithoutIdService,
  ) {}

  async onModuleInit() {
    await this.dbService.init(config, process.env.TYPEORM_BACKOFFICE_USERNAME);
    this.massiveMonetaryAdjustmentFileDB = this.dbService.getRepository(
      FileMassiveMonetaryAdjustment,
    );
    this.monetaryAdjustmentsDB = this.dbService.getRepository(
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
        this.massiveMonetaryAdjustmentFileDB = this.dbService.getRepository(
          FileMassiveMonetaryAdjustment,
        );
        this.monetaryAdjustmentsDB = this.dbService.getRepository(
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

  async createMassiveAdjustments(
    monetaryAdjustment: MassiveMonetaryAdjustmentFileDto,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<FileMassiveMonetaryAdjustment> {
    this.logger.debug('createMassiveAdjustments repository started.');
    const { frontId } = monetaryAdjustment;
    const { name, email } = adjustmentMetadata;
    const updateRegister = new UpdateAdjustmentRegister();
    updateRegister.user = [name];
    updateRegister.userEmail = [email];
    updateRegister.updatedAt = [new Date()];
    const codeDescriptions = await Promise.all(
      monetaryAdjustment.adjustments.map((adjustment) =>
        this.transactionCodeService.getDescriptionCode(
          adjustment.transactionCode,
        ),
      ),
    );
    const queryRunner = this.dbService.queryRunner;
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const updateRegisterSaved = await queryRunner.manager.save(
        updateRegister,
      );
      const massiveAdjustmentMapped = fileAdjustmentsMapperInstanced(
        monetaryAdjustment,
        email,
        updateRegisterSaved,
        codeDescriptions,
      );
      await queryRunner.manager.save(massiveAdjustmentMapped);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error?.code === '23505') {
        const findMassive = await this.massiveMonetaryAdjustmentFileDB.findOne({
          where: { frontId },
          relations: { adjustments: true },
        });
        const updateRegisterSaved = await this.getAdjustmentRegister(
          findMassive.adjustments[0].id,
        );
        const massiveAdjustmentMapped = new FileMassiveMonetaryAdjustmentMapper(
          monetaryAdjustment,
          email,
          updateRegisterSaved,
          codeDescriptions,
        );
        await Promise.all(
          massiveAdjustmentMapped.adjustments.map((adjustment) => {
            const createdAdjustment =
              this.monetaryAdjustmentsDB.create(adjustment);
            return this.monetaryAdjustmentsDB.save({
              ...createdAdjustment,
              file: findMassive,
            });
          }),
        ).catch(() => {
          throw new BadRequestException(
            ErrorCodesEnum.BOS016,
            'Error al intentar crear ajustes individuales',
          );
        });
        let massive = await this.massiveMonetaryAdjustmentFileDB.findOne({
          where: { frontId },
          relations: { adjustments: true },
        });
        const { adjustments } = massive;
        const { totalRecords } = monetaryAdjustment;
        if (+totalRecords === adjustments.length) {
          const assignedTo = await this.findNextUserMassiveService.run(
            adjustments,
            1,
          );
          const fileToUpdate = MassiveAdjustmentUpdater(massive, assignedTo);
          massive = await this.massiveMonetaryAdjustmentFileDB.save(
            fileToUpdate,
          );
        }
        await queryRunner.release();
        return massive;
      }
      throw new BadRequestException(
        ErrorCodesEnum.BOS013,
        'Error al crear el ajuste monetario masivo.',
      );
    }
    let massive = await this.massiveMonetaryAdjustmentFileDB.findOne({
      where: { frontId: frontId },
      relations: ['adjustments'],
    });
    const { adjustments } = massive;
    const { totalRecords } = monetaryAdjustment;
    if (+totalRecords === adjustments.length) {
      const assignedTo = await this.findNextUserMassiveService.run(
        adjustments,
        1,
      );
      const fileToUpdate = MassiveAdjustmentUpdater(massive, assignedTo);
      massive = await this.massiveMonetaryAdjustmentFileDB.save(fileToUpdate);
    }
    await queryRunner.release();
    return massive;
  }

  async getAdjustmentRegister(
    monetaryAdjustmentId: string,
  ): Promise<UpdateAdjustmentRegister> {
    this.logger.debug('getAdjustmentRegister repository started.');
    const adjustment = await this.monetaryAdjustmentsDB.findOneOrFail({
      where: {
        id: monetaryAdjustmentId,
      },
      relations: { updateRegister: true },
    });
    const { updateRegister } = adjustment;
    return updateRegister;
  }

  async findAllMassiveAdjustment(
    adjustmentMetadata: UserInfoInterface,
    adjustmentQueryDto: AdjustmentQueryDto,
  ): Promise<PaginationMassiveAdjustmentsResponse> {
    this.logger.debug('findAllMassiveAdjustment repository started.');
    const { limit = 0, offset = 0, filename = '' } = adjustmentQueryDto;
    const { email, transactionLevel } = adjustmentMetadata;
    try {
      let where = {};
      if (transactionLevel === 0) {
        where = {
          formattedName: ILike(`%${filename}%`),
          usersEmails: ILike(`%${email}%`),
        };
      }
      if (transactionLevel !== 0) {
        where = {
          formattedName: ILike(`%${filename}%`),
          transactionLevel: transactionLevel,
          adjustmentState: AdjustmentState.PENDING,
          assignedTo: email,
        };
      }
      const files = await this.massiveMonetaryAdjustmentFileDB.find({
        order: {
          createdAt: 'ASC',
        },
        where,
        relations: ['adjustments', 'adjustments.updateRegister'],
        skip: offset * limit,
        take: limit,
      });
      const count = await this.massiveMonetaryAdjustmentFileDB.count({
        where,
      });

      const paginationResponse = new PaginationMassiveAdjustmentsResponse(
        files,
        limit,
        offset,
        count,
      );
      return paginationResponse;
    } catch (error) {
      if (!error.response?.code) {
        this.logger.error(error);
        throw new BadRequestException(
          ErrorCodesEnum.BOS015,
          'Error al buscar los ajustes masivos',
        );
      }
      this.handleDBExceptions(error);
    }
  }

  async getOneMassive(
    id: string,
    relations: boolean,
  ): Promise<FileMassiveMonetaryAdjustment> {
    this.logger.debug('getOneMassive repository started.');
    const fileAdjustments = await this.massiveMonetaryAdjustmentFileDB.findOne({
      where: { id },
      relations: { adjustments: relations },
    });
    if (!fileAdjustments) {
      throw new NotFoundException(
        ErrorCodesEnum.BOS012,
        'No se ha encontrado el ajuste monetario',
      );
    }
    return fileAdjustments;
  }

  async patchTransactionLevel(
    fileAdjustmentsId: string,
    newTransactionLevel: number | null,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<string> {
    this.logger.debug('patchTransactionLevel repository started.');
    try {
      const file = await this.getOneMassive(fileAdjustmentsId, true);
      const { usersEmails, adjustments } = file;
      const { email } = adjustmentMetadata;
      usersEmails.push(email);
      let assignedTo;

      let toUpdate = {
        transactionLevel: newTransactionLevel,
        updatedAt: new Date(),
        usersEmails,
      };

      if (newTransactionLevel) {
        assignedTo = await this.findNextUserMassiveService.run(
          adjustments,
          newTransactionLevel,
        );
        toUpdate = { ...toUpdate, ...{ assignedTo } };
      }

      await this.massiveMonetaryAdjustmentFileDB.update(
        {
          id: fileAdjustmentsId,
        },
        toUpdate,
      );
      await this.updateAdjustmentRegister(
        adjustments[0].id,
        adjustmentMetadata,
      );
      const fileUpdated = await this.getOneMassive(fileAdjustmentsId, false);

      if (assignedTo) {
        this.createNotificationService.run(
          new CreateNotificationMassiveAdjustment(
            fileUpdated,
            adjustmentMetadata,
          ),
        );
        this.updateNotificationService.run(
          file.id,
          email,
          DateToUpdateEnum.ATTENDED_AT,
        );
      }
      return `Pass to next level ${newTransactionLevel}`;
    } catch (error) {
      this.logger.debug(error);
      if (!error.response?.code) {
        throw new BadRequestException(
          ErrorCodesEnum.BOS009,
          'Error al intentar actualizar el nivel del archivo del ajuste masivo',
        );
      }
    }
  }

  async patchAdjustmentState(
    fileAdjustmentsId: string,
    newAdjustmentState: AdjustmentState,
    adjustmentMetadata: UserInfoInterface,
    comment?: string,
    hasError?: boolean,
  ): Promise<ResponseInterface> {
    this.logger.debug('patchAdjustmentState repository started.');
    let toUpdate = {
      adjustmentState: newAdjustmentState,
      comment,
      updatedAt: new Date(),
    };
    const { email } = adjustmentMetadata;
    if (newAdjustmentState === AdjustmentState.REJECTED) {
      const file = await this.getOneMassive(fileAdjustmentsId, false);
      const { usersEmails } = file;
      usersEmails.push(email);
      toUpdate = { ...toUpdate, ...{ usersEmails } };
    }
    if (hasError) {
      toUpdate = { ...toUpdate, ...{ hasError } };
    }
    try {
      await this.massiveMonetaryAdjustmentFileDB.update(
        {
          id: fileAdjustmentsId,
        },
        toUpdate,
      );

      const file = await this.getOneMassive(fileAdjustmentsId, true);
      const { adjustments } = file;
      await this.updateAdjustmentRegister(
        adjustments[0].id,
        adjustmentMetadata,
      );

      await this.createNotificationService.run(
        new CreateNotificationMassiveAdjustment(
          file,
          adjustmentMetadata,
          newAdjustmentState,
          file.usersEmails[0],
        ),
      );
      await this.updateNotificationService.run(
        file.id,
        email,
        DateToUpdateEnum.ATTENDED_AT,
      );

      return {
        result: true,
      };
    } catch (error) {
      this.logger.error(error);
      if (!error.response?.code) {
        throw new BadRequestException(
          ErrorCodesEnum.BOS009,
          'Error al intentar actualizar el nivel del archivo del ajuste masivo',
        );
      }
    }
  }

  async reprocessAdjustmentState(id: string, notAccepted: boolean) {
    this.logger.debug('reprocessAdjustmentState repository started.');
    try {
      if (notAccepted) {
        await this.massiveMonetaryAdjustmentFileDB.update(
          {
            id: id,
          },
          {
            adjustmentState: AdjustmentState.ACCEPTED_WITH_ERROR,
            transactionLevel: null,
            updatedAt: new Date(),
            hasError: false,
          },
        );
        return;
      }
      await this.massiveMonetaryAdjustmentFileDB.update(
        {
          id: id,
        },
        {
          adjustmentState: AdjustmentState.ACCEPTED,
          transactionLevel: null,
          updatedAt: new Date(),
          hasError: false,
        },
      );
      return;
    } catch (error) {
      this.logger.error(error);
      if (!error.response?.code) {
        throw new BadRequestException(
          ErrorCodesEnum.BOS009,
          'Error al intentar actualizar el nivel del archivo del ajuste masivo',
        );
      }
    }
  }

  async patchSingleAdjustment(
    id: string,
    comment: string,
    transactionLevel: number | null,
    adjustmentState: AdjustmentState,
  ) {
    this.logger.debug('patchSingleAdjustment repository started.');
    try {
      const objectToUpdate: {
        adjustmentState: AdjustmentState;
        transactionLevel: number;
        updatedAt: Date;
        comment?: string;
      } = {
        adjustmentState,
        transactionLevel,
        updatedAt: new Date(),
      };
      if (comment) {
        objectToUpdate.comment = comment;
      }
      await this.monetaryAdjustmentsDB.update(
        {
          id: id,
        },
        objectToUpdate,
      );
      return;
    } catch (error) {
      this.logger.error(error);
      if (!error.response?.code) {
        throw new BadRequestException(
          ErrorCodesEnum.BOS009,
          'Error al intentar actualizar el archivo del ajuste masivo',
        );
      }
    }
  }

  async updateAdjustmentRegister(
    monetaryAdjustmentId: string,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<boolean> {
    this.logger.debug('updateAdjustmentRegister repository started.');
    const adjustment = await this.monetaryAdjustmentsDB.findOneOrFail({
      where: {
        id: monetaryAdjustmentId,
      },
      relations: { updateRegister: true },
    });
    const { updateRegister } = adjustment;
    const { name, email } = adjustmentMetadata;
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

  async updateSingleAdjustmentsFromFile(
    resolves: any[],
    adjustments: MonetaryAdjustmentEntityOrm[],
  ): Promise<UpdateSingleAdjustmentsResponse> {
    this.logger.debug('updateSingleAdjustmentsFromFile repository started.');
    let hasError = false;
    let notAccepted = false;
    await Promise.all(
      resolves.map(async (response, index) => {
        if (response instanceof Error) {
          const rest = JSON.parse(response.message);
          if (
            rest?.statusRS?.description &&
            rest?.statusRS?.description !== 'El Digital Service no es válido'
          ) {
            notAccepted = true;
            await this.patchSingleAdjustment(
              adjustments[index].id,
              rest.statusRS.description,
              null,
              AdjustmentState.ACCEPTED_WITH_ERROR,
            );
          } else {
            hasError = true;
            this.logger.log('Http request failed');
            await this.patchSingleAdjustment(
              adjustments[index].id,
              'Ocurrió un error, reintente mas tarde',
              null,
              AdjustmentState.FAILED,
            );
          }
        } else if (response?.statusRS?.code === '0') {
          await this.patchSingleAdjustment(
            adjustments[index].id,
            'OK',
            null,
            AdjustmentState.ACCEPTED,
          );
        }
      }),
    );
    return { hasError, notAccepted };
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    if (error.response?.code === 'BOS010') {
      throw new NotFoundException(error.response.code, error.response.error);
    }
    throw new InternalServerException(
      ErrorCodesEnum.BOS014,
      'Error inesperado, por favor revisar los logs del servidor.',
    );
  }
}
