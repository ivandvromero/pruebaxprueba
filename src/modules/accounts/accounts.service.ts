import { UserDto } from './../../providers/dale/dto/enrollment.dto';
import { SqsLogsService } from './../../providers/sqs-logs/sqs-logs.service';
import { DaleNotificationService } from './../../providers/dale/services/dale-notification.service';
import { EnrollmentService } from '../../providers/dale/services/enrollment.service';
import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PtsService } from '../../providers/pts/pts.service';
import { MambuService } from '../../providers/mambu/mambu.service';
import { v4 as uuidv4 } from 'uuid';
import {
  AccountDetailsByClientIdResponse,
  AccountStatuses,
  AccountNumbersByClientIdResponse,
  AccountDetailsByAccountIdResponse,
  AccountPTSEventDto,
  AccountEventDto,
  GetAccountsByUserIdDataResponseDto,
  GetAccountsByUserIdResponseDto,
  UpdateAccountEventDto,
  GetCertificateStrategyDataInputDto,
  GetCertificateResponseDto,
  ModifyLimitsInputDto,
} from './dto/accounts.dto';
import { PtsResponse } from './dto/pts.dto';
import {
  endpointsPTS,
  KafkaTopicsConstants,
  PTS_BASE_URL,
} from './constants/api';
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/code-errors/error-codes.enum';
import { ptsAccountCreate } from '../../providers/pts/constants/account.constans';
import { Logger } from '@dale/logger-nestjs';
import { ClientKafka } from '@nestjs/microservices';
import { AccountDbService } from '../../db/accounts/account.service';
import { Account } from '../../db/accounts/account.entity';
import { HeaderDTO } from '../../shared/models/common-header.dto';
import { UpdateCustomerDepositDto } from './dto/customer-deposit.dto';
import { CreateAccountLogEventDto } from '../../providers/sqs-logs/dto/create-account-log-event.dto';
import { AccountCreateResponse } from '../../providers/pts/dto/pts.dto';
import {
  LogTypeEnum,
  SqsLogTypeEnum,
} from '../../providers/sqs-logs/enums/log-type.enum';
import { getCurrentColombiaTime } from '@dale/shared-nestjs/utils/date';
import {
  EventRequest,
  FailedKafkaEventsValue,
  HeadersEvent,
  InsertEnrollmentQueueStepDataRequest,
} from '../../shared/dtos/events.dto';
import {
  clearObject,
  prepareHeadersForQueue,
} from '../../shared/utils/map-kafka-headers-to-dto';
import { ContextProviderService } from '../../providers/context-provider/context-provider.service';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { mapErrorChildren } from '../../utils/transform-class';
import { ConsultarCRMDTO } from '../../providers/crm/dto/consultar/crmConsulRequest.dto';
import { ServiceCRM } from '../../providers/crm/crm.service';
import { catchError, lastValueFrom } from 'rxjs';
import { DepositResponseCRM } from 'src/providers/crm/dto/actualizar/crmActualResponse.dto';
import { NormaStrategy } from './strategiesDeposit/strategy.const';

@Injectable()
export class AccountsService {
  constructor(
    private readonly mambuService: MambuService,
    private readonly ptsService: PtsService,
    private readonly accountDbService: AccountDbService,
    private readonly notificationService: DaleNotificationService,
    @Inject('KAFKA_CLIENT') private kafkaService: ClientKafka,
    private logger: Logger,
    private readonly sqsLogsService: SqsLogsService,
    private readonly enrollmentService: EnrollmentService,
    private readonly contextProvider: ContextProviderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly serviceCRM: ServiceCRM,
    private readonly normaStrategy: NormaStrategy,
  ) {}

  async accountDetailsByClientId(
    accountId: string,
    accountState?: AccountStatuses,
  ): Promise<AccountDetailsByClientIdResponse[]> {
    return await this.mambuService.accountDetailsByClientId(
      accountId,
      accountState,
    );
  }
  async accountNumbersByClientId(
    accountId: string,
  ): Promise<AccountNumbersByClientIdResponse> {
    return await this.mambuService.accountNumbersByClientId(accountId);
  }

  async accountDetailsByAccountId(
    accountId: string,
  ): Promise<AccountDetailsByAccountIdResponse> {
    return await this.mambuService.accountDetailsByAccountId(accountId);
  }

  async getLimitsAccumulatorsByAccount(
    accountId: string,
  ): Promise<PtsResponse> {
    try {
      const url = `${PTS_BASE_URL}${
        endpointsPTS.LIMITS_ACCUMULATORS +
        'AK-MAMBU-' +
        accountId +
        '/account-info'
      }`;
      const response = await this.ptsService.get(url);
      for (const [
        index,
        element,
      ] of response.messageRS.accumulators.entries()) {
        const countModify =
          (await this.cacheManager.get(
            `modifyLimits:${element.accumulator}${accountId}`,
          )) || 0;

        response.messageRS.accumulators[index].canUpdate =
          countModify >= 3 ? false : true;
      }
      return response;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN008, error);
    }
  }

  async createAccountInPTS(event: AccountPTSEventDto, headers: HeadersEvent) {
    try {
      this.logger.log(`Begin call pts Service`, event.enrollmentId);
      const response = await this.ptsService.createAccount(event);
      if (
        !response.messageRS.ThirdPartyData.id &&
        response.messageRS.ThirdPartyData.accountState !==
          ptsAccountCreate.PTS_ACCOUNT_STATE_RESPONSE &&
        response.statusRS.code !== '0'
      ) {
        this.logger.log(`creating account failed`, event.enrollmentId);
        return false;
      } else {
        this.logger.log(
          `account created with success`,
          response.messageRS.ThirdPartyData.id,
        );

        const createAccountEvent: AccountEventDto = {
          userId: event.userId,
          accountId: response.messageRS.ThirdPartyData.id,
          phoneNumber: event.phoneNumber,
          phonePrefix: event.phonePrefix,
          enrollmentId: event.enrollmentId,
          customerExternalId: event.customerExternalId,
          customerExternalNumber: event.customerExternalNumber,
        };
        const payload: EventRequest<AccountEventDto> = {
          value: createAccountEvent,
          headers: prepareHeadersForQueue(headers),
        };

        this.kafkaService.emit(
          KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT,
          payload,
        );

        await this.sendSqsLog(event.enrollmentId, headers, null, response);
        return true;
      }
    } catch (error) {
      await this.sendSqsLog(event.enrollmentId, headers, error, null);
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN001, error);
    }
  }

  async createAccountDb(event: AccountEventDto, headers: HeadersEvent) {
    try {
      const id = uuidv4();
      const account: Account = {
        id: id,
        accountNumber: event.accountId,
        userId: event.userId,
        updateAt: getCurrentColombiaTime(),
      };
      await this.accountDbService.createAccount(account);

      await this.notificationService.sendSmsNotification(
        event.userId,
        event.phonePrefix ?? '57',
        event.phoneNumber,
        false,
      );

      const updateCustomerEvent: UpdateCustomerDepositDto = {
        userId: event.userId,
        accountId: event.accountId,
        enrollmentId: event.enrollmentId,
        customerExternalId: event.customerExternalId,
        customerExternalNumber: event.customerExternalNumber,
        agreementId: account.agreementId,
      };
      const payload: EventRequest<UpdateCustomerDepositDto> = {
        value: updateCustomerEvent,
        headers: prepareHeadersForQueue(headers),
      };

      this.kafkaService.emit(
        KafkaTopicsConstants.CRM_TOPIC_UPDATE_CUSTOMER,
        payload,
      );

      return true;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN005, error);
    }
  }

  async updateAccountEvent(
    event: UpdateAccountEventDto,
    headers: HeadersEvent,
  ) {
    try {
      this.logger.log(
        `init updateAccountEvent dataEvent: ${JSON.stringify(event)}`,
        headers.transactionId,
      );
      const account =
        await this.accountDbService.getOneAccountByUserIdAndAccountNumber(
          event.userId,
          event.accountId,
          headers,
        );
      account.crmContactAgreementId = event.crmContactAgreementId;
      account.crmDepositId = event.crmDepositId;
      account.updateAt = getCurrentColombiaTime();

      await this.accountDbService.updateAccount(account.id, account, headers);
      this.logger.log(`updateAccountEvent Success`, headers.transactionId);
      return true;
    } catch (error) {
      this.logger.error(
        `updateAccountEvent exception dataEvent: ${JSON.stringify(event)}`,
        error,
        headers.transactionId,
      );
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN013, error);
    }
  }

  async getAccountsByUserId(
    userId: string,
    headers: HeaderDTO,
  ): Promise<GetAccountsByUserIdDataResponseDto> {
    try {
      const accounts = await this.accountDbService.getAccountsByUserId(
        userId,
        headers,
      );
      const accountsNumber: GetAccountsByUserIdResponseDto[] = accounts.map(
        (data) => ({
          id: data.id,
          accountNumber: data.accountNumber,
          agreementId: data.agreementId,
          crmDepositId: data.crmDepositId,
          crmContactAgreementId: data.crmContactAgreementId,
        }),
      );
      return new GetAccountsByUserIdDataResponseDto({ data: accountsNumber });
    } catch (error) {
      this.logger.error(
        'error getAccountsByUserId ',
        error,
        headers.TransactionId,
      );
      throw error;
    }
  }

  async sendSqsLog(
    enrollmentId: string,
    headers,
    error?,
    account?: AccountCreateResponse,
  ) {
    const isSucees: boolean = error ? false : true;
    const type: string = error ? LogTypeEnum.ERROR : LogTypeEnum.SUCCESS;
    let userData: UserDto;
    try {
      this.logger.log(
        `Begin call enrollment Service get data by id`,
        enrollmentId,
      );
      userData = await this.enrollmentService.getUserDataByEnrollmentId(
        enrollmentId,
      );
      this.logger.log(
        `End call enrollment Service get data by id with result:`,
        JSON.stringify(userData),
      );
    } catch (error) {
      this.logger.error(
        'End call enrollment Service with error',
        error.response?.code,
      );
    }
    try {
      const body: CreateAccountLogEventDto = {
        mambuId: account?.messageRS?.othersId?.MAMBU ?? '',
        ptsId: account?.messageRS?.ThirdPartyData?.id ?? '',
        accountType: 'SIMPLIFICADO',
        destination: 'PTS',
        documentNumber: userData?.person?.documentNumber ?? '',
        documentType: userData?.person?.documentType ?? '2',
        phone: userData?.person?.phoneNumber ?? '',
      };

      this.logger.log(`send message to SQS Service`, JSON.stringify(body));
      await this.sqsLogsService.sendMessageLog<CreateAccountLogEventDto>(
        {
          body,
          data: {
            attempt: userData?.deviceInfo?.attempt.toString() ?? 0,
            enrollmentId,
            error,
          },
          headers,
          type: type,
        },
        SqsLogTypeEnum.CREATE_ACCOUNT,
        isSucees,
      );
    } catch (error) {
      this.logger.error('Error sendSqsLog', error);
    }
  }

  async kafkaQueueRetry<T>(
    topic: string,
    maxAttemptsTopic: number,
    payload: EventRequest<T>,
    error: string,
  ) {
    if (Number(payload.headers.attempts) < maxAttemptsTopic) {
      payload.headers.attempts = (
        Number(payload.headers.attempts) + 1
      ).toString();
      this.logger.log(
        `Enviar a cola de reintento Topico: ${topic} - payload: ${JSON.stringify(
          payload,
        )}`,
        payload.headers.transactionId,
      );
      this.kafkaService.emit(topic, payload);
    } else {
      this.logger.log(
        `Reintentos del Topico: ${topic} superados - maxAttemptsTopic: ${maxAttemptsTopic} - payload: ${JSON.stringify(
          payload,
        )}`,
        payload.headers.transactionId,
      );
      await this.sendToFailedRequestQueue(topic, payload, error);
    }
  }
  async sendToFailedRequestQueue<T>(
    topic: string,
    originalPayload: EventRequest<T>,
    error: string,
  ) {
    const errorPayload: FailedKafkaEventsValue<T> = {
      topic,
      value: originalPayload.value,
      headers: originalPayload.headers,
      attempts: originalPayload.headers.attempts,
      error,
    };
    const bodyEvent: EventRequest<FailedKafkaEventsValue<T>> = {
      value: errorPayload,
      headers: prepareHeadersForQueue(originalPayload.headers),
    };
    this.kafkaService.emit(
      KafkaTopicsConstants.TOPIC_FAILED_REQUEST_QUEUE,
      bodyEvent,
    );
  }
  async insertEnrollmentQueueStepData(
    data: InsertEnrollmentQueueStepDataRequest,
    headers: HeadersEvent,
  ) {
    clearObject(headers);
    const bodyEvent: EventRequest<InsertEnrollmentQueueStepDataRequest> = {
      value: data,
      headers,
    };

    this.kafkaService.emit(
      KafkaTopicsConstants.TOPIC_ENROLLMENT_NANTURAL_PERSON_INSERT_STEP,
      bodyEvent,
    );
  }
  async getCertificate(
    inputData: GetCertificateStrategyDataInputDto,
    headers: HeaderDTO,
  ): Promise<GetCertificateResponseDto> {
    this.logger.log(
      `Begin get certificate info - templateName: ${inputData.templateName}`,
      headers.TransactionId,
    );
    this.contextProvider.setStrategy(inputData.templateName);
    const certificateData = await this.contextProvider.generateCertificateData(
      inputData,
      headers,
    );
    const certificateUrl = await this.contextProvider.generateCertificate(
      certificateData,
    );
    this.logger.log(
      `End get certificate info - templateName: ${inputData.templateName}`,
      headers.TransactionId,
    );
    return { url: certificateUrl };
  }

  async modifyLimits(body: ModifyLimitsInputDto, headers: HeaderDTO) {
    try {
      return await this.ptsService.modifyLimits(body, headers);
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN022, error);
    }
  }

  async consultDeposit(params: ConsultarCRMDTO): Promise<DepositResponseCRM> {
    const reponseCRM = await this.serviceCRM.consultElectronicDeposit(params);
    this.logger.log(
      `Response service account CRM operations consult the electronic deposit for given accountId`,
    );
    return reponseCRM;
  }

  async updateDeposit(parasms: DepositResponseCRM): Promise<any> {
    const reponseCRM = await this.serviceCRM.updateElectronicDeposit(parasms);
    this.logger.log(
      `Response CRM operations update the electronic deposit for given accountId`,
      JSON.stringify(reponseCRM),
    );
    //Send Event Kafka
    const responseEvent = await this.sendEventUpdate(parasms);
    this.logger.log(
      `Response CRM operations event the electronic deposit for given accountId`,
      JSON.stringify(responseEvent),
    );
    return responseEvent;
  }

  async strategUpdateDeposit(params: DepositResponseCRM): Promise<any> {
    try {
      //Estrategia Validacion
      let respStrategy;
      let strategia;
      switch (params.cambioEstado) {
        case 'BLOQUEADO':
          strategia = this.normaStrategy.valoreStrategy.mambuBloquear;
          respStrategy = await this.normaStrategy.valoreStrategy[
            strategia
          ].changeOfDepositStatus(params);
          return respStrategy;
        case 'CONGELADO':
          strategia = this.normaStrategy.valoreStrategy.mambuCongelar;
          respStrategy = await this.normaStrategy.valoreStrategy[
            strategia
          ].changeOfDepositStatus(params);
          return respStrategy;
        case 'CANCELADO':
          strategia = this.normaStrategy.valoreStrategy.ptsCancelar;
          respStrategy = await this.normaStrategy.valoreStrategy[
            strategia
          ].changeOfDepositStatus(params);
          return respStrategy;
        case 'EMBARGADO':
          strategia = this.normaStrategy.valoreStrategy.ptsEmbargar;
          respStrategy = await this.normaStrategy.valoreStrategy[
            strategia
          ].changeOfDepositStatus(params);
          return respStrategy;
        default:
          break;
      }
      this.logger.log('Response Strategy Cambio De Estado: ', respStrategy);
      return respStrategy;
    } catch (error) {
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN001, error);
    }
  }
  async validateMessageEvent(eventObject): Promise<DepositResponseCRM> {
    const dto = plainToInstance(DepositResponseCRM, eventObject);
    const errors: ValidationError[] = await validate(dto);
    if (errors.length) {
      const error = mapErrorChildren(errors);
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN001, error);
    }
    return eventObject;
  }

  async sendEventUpdate(eventObject: DepositResponseCRM) {
    const res = await lastValueFrom(
      this.kafkaService
        .emit(KafkaTopicsConstants.BACKOFFICE_TOPIC_MAMBU, eventObject)
        .pipe(
          catchError(async (err) => {
            throw new InternalServerExceptionDale(ErrorCodesEnum.ACN001, err);
          }),
        ),
    );
    this.logger.log(`successfully send`);
    return res;
  }
}
