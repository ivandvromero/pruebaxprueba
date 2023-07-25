import { Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { MonetaryAdjustmentDto } from '../dto/monetary-adjustment.dto';
import { AdjustmentQueryDto } from '../dto/get-adjustment-query.dto';
import { AdjustmentValidationsDTO } from '../dto/adjustment-validations.dto';
import { PaginationAdjustmentsResponse } from '../../../shared/common/get-adjustments-response';
import { ResponseInterface } from '../../../shared/interfaces/response-interface';
import { TransactionLevel } from '../chain-handlers/handlers/transaction-level';
import { TransactionDispatch } from '../chain-handlers/handlers/transaction-dispatch';
import { MonetaryAdjustmentRepository } from '../../../repositories/monetary-adjustment/monetary-adjustment.repository';
import { AdjustmentState } from '../../../shared/enums/adjustment-state.enum';
import { MonetaryAdjustmentEntity } from '../../../shared/interfaces/monetary-adjustment.entity';
import { MassiveMonetaryAdjustmentFileDto } from '../dto/massive-monetary-adjustment-file.dto';
import { MassiveMonetaryAdjustmentFileRepository } from '../../../repositories/file-monetary-adjustment/massive-monetary-adjustment-file.repository';
import * as ExcelJs from 'exceljs';
import { PaginationMassiveAdjustmentsResponse } from '../../../shared/common/get-massive-files-response';
import { MassiveTransactionLevel } from '../chain-handlers/massive handlers/massive-transaction-level';
import { MassiveTransactionDispatch } from '../chain-handlers/massive handlers/massive-transaction-dispatch';
import { FileMassiveMonetaryAdjustment } from '../../../repositories/monetary-adjustment/monetary-adjustment.entity';
import { MassiveAdjustmentReason } from '../../../shared/enums/massive-adjustment-reason.enum';
import { Colums } from '../../../shared/common/excel-headers';
import { TransactionMapper } from '../../../shared/common/transaction-mapper';
import { TransactionService } from '@dale/client/modules/services/transaction.service';
import { AdjustmentStateDto } from '../dto/adjustment-state.dto';
import { AdjustmentsRegisterRepository } from '../../../repositories/activity-update/adjustment-registrer.repository';
import { PaginationRegisterAdjustmentsResponse } from '../../../shared/common/get-adjustment-registrer-response';
import { GetAdjustmentQueryReportsDto } from '../dto/get-adjustment-reports.dto';
import { ColumsRegistrer } from '../../../shared/common/excel-registrer-headers';
import { Buffer as ExcelJsBuffer } from 'exceljs';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { FindNextUserSingleMonetaryAdjustmentService } from './find-next-user-single-monetary-adjustment.service';
import { dateFormatter } from '@dale/crm-connector-adapter/helpers/date-formater';
import { AdjustmentStateTranslations } from '@dale/monetary-adjustment/shared/enums/adjustment-state-translations.enum';
import { getPtsErrorMessage } from '@dale/monetary-adjustment/shared/common/get-pts-message-error';
import { CreateNotificationService } from '@dale/notifications/services/create-notification.service';
import { UpdateNotificationWithoutIdService } from '@dale/notifications/services/update-notification-date-without-id.service';
import { CreateNotificationMassiveAdjustment } from '@dale/notifications/shared/common/create-notification-massive-adjustments';
import { DateToUpdateEnum } from '@dale/notifications/shared/enums/date-to-update.enum';
import { BadRequestException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
//implements MonetaryAdjustmentRepositoryDB
export class MonetaryAdjustmentService {
  constructor(
    private readonly monetaryAdjustmentRepository: MonetaryAdjustmentRepository,
    private readonly massiveMonetaryAdjustmentFileRepository: MassiveMonetaryAdjustmentFileRepository,
    private readonly adjustmentsRegisterRepository: AdjustmentsRegisterRepository,
    @Optional() private logger: Logger,
    private readonly transactionLevel: TransactionLevel,
    private readonly transactionDispatch: TransactionDispatch,
    private readonly massiveTransactionLevel: MassiveTransactionLevel,
    private readonly massiveTransactionDispatch: MassiveTransactionDispatch,
    private readonly transactionService: TransactionService,
    private readonly findNextUserService: FindNextUserSingleMonetaryAdjustmentService,
    private readonly createNotificationService: CreateNotificationService,
    private readonly updateNotificationService: UpdateNotificationWithoutIdService,
  ) {}

  async createAdjustment(
    adjustmentMetadata: UserInfoInterface,
    monetaryAdjustmentDTO: MonetaryAdjustmentDto,
  ): Promise<MonetaryAdjustmentEntity> {
    this.logger.debug('createAdjustment.service started');
    const { transactionCode } = monetaryAdjustmentDTO;
    const assignedTo = await this.findNextUserService.run(transactionCode, 1);
    const entity: MonetaryAdjustmentEntity = {
      ...monetaryAdjustmentDTO,
      assignedTo,
    };
    return this.monetaryAdjustmentRepository.createAdjustment(
      adjustmentMetadata,
      entity,
    );
  }

  async findAll(
    adjustmentMetadata: UserInfoInterface,
    adjustmentQueryDto: AdjustmentQueryDto,
    count?: boolean,
  ): Promise<PaginationAdjustmentsResponse> {
    this.logger.debug('findAll.service started');
    return await this.monetaryAdjustmentRepository.findAll(
      adjustmentMetadata,
      adjustmentQueryDto,
      count,
    );
  }

  patchTransactionLevel(
    adjustmentId: string,
    newTransactionLevel: number,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<string> {
    this.logger.debug('patchTransactionLevel.service started');
    return this.monetaryAdjustmentRepository.patchTransactionLevel(
      adjustmentId,
      newTransactionLevel,
      adjustmentMetadata,
    );
  }

  patchAdjustmentState(
    adjustmentId: string,
    newAdjustmentState: AdjustmentState,
    adjustmentMetadata: UserInfoInterface,
    comment?: string | null,
  ): Promise<ResponseInterface> {
    this.logger.debug('patchAdjustmentState.service started');
    return this.monetaryAdjustmentRepository.patchAdjustmentState(
      adjustmentId,
      newAdjustmentState,
      adjustmentMetadata,
      comment,
    );
  }

  findAdjustmentById(adjustmentId: string): Promise<MonetaryAdjustmentEntity> {
    return this.monetaryAdjustmentRepository.findAdjustmentById(adjustmentId);
  }

  async adjustmentValidations(
    adjustmentId: string,
    payload: AdjustmentValidationsDTO,
    transactionLevelProperty: number,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<ResponseInterface> {
    this.logger.debug('adjustmentValidations.service started');
    const { approved, comment } = payload;
    if (!approved) {
      return this.patchAdjustmentState(
        adjustmentId,
        AdjustmentState.REJECTED,
        adjustmentMetadata,
        comment,
      );
    }

    const transactionLevelResp = await this.transactionLevel.handle(
      adjustmentId,
      transactionLevelProperty,
      adjustmentMetadata,
    );
    const transactionDispatchResp = await this.transactionDispatch.handle(
      adjustmentId,
      transactionLevelProperty,
      adjustmentMetadata,
    );

    return transactionLevelResp
      ? transactionLevelResp
      : transactionDispatchResp;
  }

  async createMassiveAdjustment(
    massiveMonetaryAdjustmentFileDto: MassiveMonetaryAdjustmentFileDto,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<FileMassiveMonetaryAdjustment> {
    this.logger.debug('createAdjustment.service started!');
    const massiveCreated =
      await this.massiveMonetaryAdjustmentFileRepository.createMassiveAdjustments(
        massiveMonetaryAdjustmentFileDto,
        adjustmentMetadata,
      );
    const { totalRecords } = massiveMonetaryAdjustmentFileDto;
    if (totalRecords === massiveCreated.totalRecords)
      await this.createNotificationService.run(
        new CreateNotificationMassiveAdjustment(
          massiveCreated,
          adjustmentMetadata,
        ),
      );
    return massiveCreated;
  }

  async findAllMassiveAdjustment(
    adjustmentMetadata: UserInfoInterface,
    adjustmentQueryDto: AdjustmentQueryDto,
    counter?: boolean,
  ): Promise<PaginationMassiveAdjustmentsResponse> {
    this.logger.debug('findAllMassiveAdjustment.service started!');
    const paginatedResponse =
      await this.massiveMonetaryAdjustmentFileRepository.findAllMassiveAdjustment(
        adjustmentMetadata,
        adjustmentQueryDto,
      );
    if (!counter) {
      const { email } = adjustmentMetadata;
      await Promise.all(
        paginatedResponse.results.map(async (file) => {
          await this.updateNotificationService.run(
            file.id,
            email,
            DateToUpdateEnum.VIEWED_AT,
          );
        }),
      );
    }
    return paginatedResponse;
  }

  async getMassiveMonetaryAdjustment(
    id: string,
  ): Promise<FileMassiveMonetaryAdjustment> {
    return await this.massiveMonetaryAdjustmentFileRepository.getOneMassive(
      id,
      true,
    );
  }

  async createArchive(id: string, log: string): Promise<ExcelJsBuffer> {
    const archive = await this.getMassiveMonetaryAdjustment(id);

    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet(`${archive.formattedName}`);
    worksheet.columns = Colums;
    const column1: string[] = ['Nombre Archivo'];
    const column2: string[] = ['Log de Error'];
    const column3: object[] | string[] = ['Nombre Trx'];
    archive.adjustments.forEach((MassiveMonetaryAdjustment) => {
      worksheet.addRow({
        dateFile: MassiveMonetaryAdjustment.dateFile,
        depositNumber: MassiveMonetaryAdjustment.depositNumber,
        amount: MassiveMonetaryAdjustment.amount,
        adjustmentType:
          MassiveMonetaryAdjustment.adjustmentType === 'CREDIT'
            ? 'Crédito'
            : 'Débito',
        transactionCode: MassiveMonetaryAdjustment.transactionCode,
        transactionDescription:
          MassiveMonetaryAdjustment.transactionName.replace('AMM - ', ''),
        fees: MassiveMonetaryAdjustment.fees,
        vat: MassiveMonetaryAdjustment.vat,
        gmf: MassiveMonetaryAdjustment.gmf,
        adjustmentReason:
          MassiveMonetaryAdjustment.adjustmentReason ===
          'AJUSTE_POR_RECLAMACION'
            ? MassiveAdjustmentReason.AJUSTE_POR_RECLAMACION
            : MassiveAdjustmentReason.AJUSTE_POR_CONCILIACION,
        responsible: MassiveMonetaryAdjustment.responsible,
      });
      if (log === 'true') {
        column1.push(archive.formattedName);
        column2.push(getPtsErrorMessage(MassiveMonetaryAdjustment.comment));
        column3.push(MassiveMonetaryAdjustment.transactionName);
      }
    });
    if (log === 'true') {
      worksheet.spliceColumns(1, 0, column1);
      worksheet.spliceColumns(3, 0, column2);
      worksheet.spliceColumns(5, 0, column3);
      const column4 = worksheet.getColumn(1);
      column4.width = 30;
      const column5 = worksheet.getColumn(3);
      column5.width = 50;
      const column6 = worksheet.getColumn(5);
      column6.width = 25;
    }
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async getFormattedName(id: string): Promise<string> {
    const data = await this.getMassiveMonetaryAdjustment(id);
    return data.formattedName;
  }

  async patchMassiveAdjustmentState(
    fileAdjustmentsId: string,
    newAdjustmentFileState: AdjustmentState,
    adjustmentMetadata: UserInfoInterface,
    comment?: string | null,
  ): Promise<ResponseInterface> {
    const file =
      await this.massiveMonetaryAdjustmentFileRepository.getOneMassive(
        fileAdjustmentsId,
        true,
      );
    await Promise.all(
      file.adjustments.map(async (adjustment) => {
        return await this.massiveMonetaryAdjustmentFileRepository.patchSingleAdjustment(
          adjustment.id,
          comment,
          adjustment.transactionLevel,
          newAdjustmentFileState,
        );
      }),
    );
    return this.massiveMonetaryAdjustmentFileRepository.patchAdjustmentState(
      fileAdjustmentsId,
      newAdjustmentFileState,
      adjustmentMetadata,
      comment,
    );
  }

  async adjustmentFiletValidations(
    fileAdjustmentsId: string,
    payload: AdjustmentValidationsDTO,
    transactionLevelProperty: number,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<ResponseInterface> {
    const { approved, comment } = payload;
    if (!approved) {
      return this.patchMassiveAdjustmentState(
        fileAdjustmentsId,
        AdjustmentState.REJECTED,
        adjustmentMetadata,
        comment,
      );
    }
    const massiveFileLevelResp = await this.massiveTransactionLevel.handle(
      fileAdjustmentsId,
      transactionLevelProperty,
      adjustmentMetadata,
    );
    const massiveFileDispatchResp =
      await this.massiveTransactionDispatch.handle(
        fileAdjustmentsId,
        transactionLevelProperty,
        adjustmentMetadata,
      );
    return massiveFileLevelResp
      ? massiveFileLevelResp
      : massiveFileDispatchResp;
  }

  async reprocessFile(id: string): Promise<void | ResponseInterface> {
    const file =
      await this.massiveMonetaryAdjustmentFileRepository.getOneMassive(
        id,
        true,
      );
    if (file.adjustmentState !== AdjustmentState.FAILED) {
      return;
    }

    const { adjustments } = file;
    const transactionArray = adjustments.map((adjustment) => {
      if (adjustment.adjustmentState !== AdjustmentState.FAILED) {
        return false;
      }
      return new TransactionMapper(adjustment);
    });

    let resolves;

    await Promise.all(
      transactionArray.map((adjustment) => {
        if (!adjustment) return false;
        return this.transactionService
          .sendTransaction(adjustment)
          .catch((error) => {
            return error;
          });
      }),
    ).then((response) => {
      resolves = response;
    });

    const resp =
      await this.massiveMonetaryAdjustmentFileRepository.updateSingleAdjustmentsFromFile(
        resolves,
        adjustments,
      );

    const { hasError, notAccepted } = resp;

    if (!hasError) {
      await this.massiveMonetaryAdjustmentFileRepository.reprocessAdjustmentState(
        id,
        notAccepted,
      );
      return;
    }
    throw new BadRequestException(
      ErrorCodesEnum.BOS031,
      'Ocurrió un error, reintente mas tarde',
    );
  }

  async getAdjustmentState(codes: string[]): Promise<AdjustmentStateDto> {
    const endDate = new Date();
    const initialDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    const approved = await this.monetaryAdjustmentRepository.countAccepted(
      initialDate,
      endDate,
      codes,
    );
    const rejected = await this.monetaryAdjustmentRepository.countFailed(
      initialDate,
      endDate,
      codes,
    );
    return {
      approved,
      rejected,
    };
  }

  async countPendingIndividual(
    adjustmentMetadata: UserInfoInterface,
    adjustmentQueryDto: AdjustmentQueryDto,
  ): Promise<number> {
    const result = this.findAll(adjustmentMetadata, adjustmentQueryDto, true);
    return (await result).total;
  }

  async countPendingMassive(
    adjustmentMetadata: UserInfoInterface,
    adjustmentQueryDto: AdjustmentQueryDto,
  ): Promise<number> {
    try {
      const result = this.findAllMassiveAdjustment(
        adjustmentMetadata,
        adjustmentQueryDto,
        true,
      );
      return (await result).total;
    } catch (error) {
      return 0;
    }
  }

  async adjustmentReports(
    getAdjustmentQueryReportsDto: GetAdjustmentQueryReportsDto,
  ): Promise<PaginationRegisterAdjustmentsResponse> {
    return this.adjustmentsRegisterRepository.findAll(
      getAdjustmentQueryReportsDto,
    );
  }

  async generateArchiveReport(
    getAdjustmentQueryReportsDto: GetAdjustmentQueryReportsDto,
  ): Promise<ExcelJsBuffer> {
    getAdjustmentQueryReportsDto.limit = 0;
    getAdjustmentQueryReportsDto.offset = 0;
    const archive = await this.adjustmentReports(getAdjustmentQueryReportsDto);
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet(`NombreArchivo`);
    worksheet.columns = ColumsRegistrer;
    archive.results.forEach((registrer) => {
      worksheet.addRow({
        transactionCode: registrer.transactionCode,
        transactionDescription: registrer.transactionDescription,
        adjustmentType:
          registrer.adjustmentType === 'CREDIT' ? 'CRÉDITO' : 'DÉBITO',
        amount: registrer.amount,
        depositNumber: registrer.depositNumber,
        captureruser: registrer.capturerUser,
        dateCapturer: dateFormatter(registrer.dateCaptured),
        verifierUser: registrer.verifierUser,
        dateVerified: dateFormatter(registrer.dateVerified),
        approverUser: registrer.approverUser,
        dateApproved: dateFormatter(registrer.dateApproved),
        adjustmentState: AdjustmentStateTranslations[registrer.adjustmentState],
        comment: registrer.comment,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
