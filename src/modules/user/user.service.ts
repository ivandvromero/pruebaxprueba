import { removeAccents } from './../../shared/utils/remove-acents';
import {
  UserDetails,
  UserResponse,
  AddUserDepositDto,
  CreateUserRequestDto,
  UserEventDto,
  CreateUserDataResponseDto,
  CreateUserLog,
} from './dto/user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { UserDbService } from '../../db/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { EntityDoesNotExistException } from '@dale/shared-nestjs/custom-errors/custom-exception';
import {
  ErrorCodes,
  ErrorObjectType,
  USER_DOES_NOT_EXIST_DETAIL,
  USER_DOES_NOT_EXIST_REASON,
} from '@dale/shared-nestjs/constants/system-errors';
import { DepositDbService } from '../../db/deposit/deposit.service';

import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import serviceConfiguration from '../../config/service-configuration';
import {
  BadRequestExceptionDale,
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ClientKafka } from '@nestjs/microservices';
import { User } from 'src/db/user/user.entity';
import { HeaderDTO } from 'src/shared/dto/header.dto';
import { Logger } from '@dale/logger-nestjs';
import { KafkaTopicsConstants } from './constants/api';
import { SqsLogsService } from '../../providers/sqs-logs/sqs-logs.service';
import {
  LogTypeEnum,
  SqsLogTypeEnum,
} from 'src/providers/sqs-logs/enums/log-type.enum';
import { getCurrentColombiaTime } from '@dale/shared-nestjs/utils/date';
import {
  EventRequest,
  FailedKafkaEventsValue,
  HeadersEvent,
  InsertEnrollmentQueueStepDataRequest,
} from 'src/shared/dto/events.dto';
import {
  clearObject,
  prepareHeadersForQueue,
} from 'src/shared/utils/map-kafka-headers-to-dto';
import {
  UpdateLocateDto,
  UpdateLocateUserResponse,
} from './dto/update-locate.dto';
import { RequirementsUserResponseData } from './dto/requirements-user.dto';

const errors: ErrorObjectType[] = [
  {
    code: ErrorCodes.USER_DOES_NOT_EXIST_CODE,
    reason: USER_DOES_NOT_EXIST_REASON,
    source: serviceConfiguration().service.name,
    details: USER_DOES_NOT_EXIST_DETAIL,
  },
];
@Injectable()
export class UserService {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
    private userDbService: UserDbService,
    private depositDbService: DepositDbService,
    private readonly logger: Logger,
    private readonly sqsLogsservice: SqsLogsService,
  ) {}

  async createUser(
    user: CreateUserRequestDto,
    headers: HeaderDTO,
  ): Promise<CreateUserDataResponseDto> {
    try {
      const userId = uuidv4();
      this.logger.log(
        `prepare new user data, userId: ${userId}`,
        headers.TransactionId,
      );
      const newUser: User = {
        id: userId,
        documentNumber: user.documentNumber,
        documentType: user.documentType,
        firstName: removeAccents(user.firstName),
        secondName: removeAccents(user.secondName),
        username: user.username,
        firstSurname: removeAccents(user.firstSurname),
        secondSurname: removeAccents(user.secondSurname),
        gender: user.gender,
        userGender: user.userGender,
        email: user.email,
        phoneNumber: user.phoneNumber,
        phonePrefix: user.phonePrefix,
        enrollmentId: user.enrollmentId,
        deviceId: user.deviceId,
        createAt: getCurrentColombiaTime(),
        updateAt: getCurrentColombiaTime(),
      };
      await this.userDbService.createUser(newUser);

      return { data: { id: userId, username: user.username } };
    } catch (error) {
      this.logger.error(`Error new user`, error, headers.TransactionId);
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MUS015, error);
    }
  }
  async updateUserEvent(user: UserEventDto, headers?): Promise<boolean> {
    let body;
    try {
      const userDetail = await this.userDbService.findUserByPhoneNumber(
        user.phoneNumber,
      );
      await this.userDbService.updateUserById(userDetail.id, {
        ...userDetail,
        bPartnerId: user.bPartnerId,
        externalId: user.externalId.toString(),
        externalNumber: user.externalNumber,
        updateAt: getCurrentColombiaTime(),
      });
      const payload: EventRequest<any> = {
        value: {
          userId: userDetail.id,
          enrollmentId: user.enrollmentId,
          bPartnerId: user.bPartnerId,
          customerExternalId: user.externalId,
          customerExternalNumber: user.externalNumber,
          phoneNumber: user.phoneNumber,
          phonePrefix: userDetail.phonePrefix ?? '57',
        },
        headers: prepareHeadersForQueue(headers),
      };
      this.kafkaClient.emit(
        KafkaTopicsConstants.TOPIC_CREATE_PTS_ACCOUNT,
        payload,
      );
      body = {
        responseIdentifier: user.bPartnerId,
        documentNumber: userDetail.documentNumber,
        documentType: userDetail.documentType,
        attempt: 0,
        phone: userDetail.phoneNumber,
      } as CreateUserLog;
      await this.sqsLogsservice.sendMessageLog(
        {
          body,
          data: {
            userDetail,
            enrollmentId: user.enrollmentId,
          },
          headers,
          type: LogTypeEnum.SUCCESS,
        },
        SqsLogTypeEnum.CREATE_USER,
        true,
      );
      return true;
    } catch (error) {
      this.logger.error(`Error Update user Event`, error);
      if (!(error instanceof CustomException)) {
        error = new InternalServerExceptionDale(ErrorCodesEnum.MUS012, error);
      }

      await this.sqsLogsservice.sendMessageLog(
        {
          body,
          data: {
            ...error,
            enrollmentId: user.enrollmentId,
          },
          headers,
          type: LogTypeEnum.ERROR,
        },
        SqsLogTypeEnum.CREATE_USER,
        false,
      );

      throw error;
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      const result: User = await this.userDbService.findUserById(id);
      if (!result) {
        throw new EntityDoesNotExistException(errors);
      }
      return result;
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  async findUser(
    documentNumber: string,
    phoneNumber: string,
    accountNumber: string,
    email: string,
    id: string,
  ) {
    try {
      let result;
      if (documentNumber) {
        result = await this.userDbService.findUserByDocumentNumber(
          documentNumber,
        );
        result = result ? result : { error: 'MUS006' };
      } else if (phoneNumber) {
        result = await this.userDbService.findUserByPhoneNumber(phoneNumber);
        result = result ? result : { error: 'MUS004' };
      } else if (accountNumber) {
        const deposit = await this.depositDbService.findDepositByAccountNumber(
          accountNumber,
        );
        result = deposit?.user;
        result = result ? result : { error: 'MUS003' };
      } else if (email) {
        result = await this.userDbService.findUserByEmail(email);
        result = result ? result : { error: 'MUS007' };
      } else if (id) {
        result = await this.userDbService.findUserById(id);
        result = result ? result : { error: 'MUS009' };
      } else throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, null); //'MUS007'
      if (!result.error)
        result.accountsNumber = await this.depositDbService.findDepositByUserId(
          result.id,
        );
      return result;
    } catch (error) {
      if (error instanceof CustomException) throw error;
      console.error(error);
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  async validateUserExist(accountNumber: string, phoneNumber: string) {
    try {
      let result;
      let response;
      if (accountNumber) {
        result = await this.depositDbService.findDepositByAccountNumber(
          accountNumber,
        );
        if (!result)
          throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, null); //'MUS003'
        response = {
          phoneNumber: result?.user.phoneNumber,
          accountsNumber: [result?.accountNumber],
        };
      } else {
        result = await this.userDbService.findUserByPhoneNumber(phoneNumber);
        if (!result)
          throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, null); //'MUS004'
        const accountNumbers = await this.depositDbService.findDepositByUserId(
          result?.id,
        );
        response = {
          phoneNumber: result?.phoneNumber,
          accountsNumber: accountNumbers,
        };
      }
      return response;
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  async updateUserByEmail(
    email: string,
    userDetails: UserDetails,
  ): Promise<UserResponse> {
    try {
      const response = await this.userDbService.updateUserByEmail(
        email,
        userDetails,
      );
      if (response.affected) {
        return;
      } else {
        throw new EntityDoesNotExistException(errors);
      }
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  async updateUserById(
    id: string,
    userDetails: UserDetails,
  ): Promise<UserResponse> {
    try {
      const response = await this.userDbService.updateUserById(id, userDetails);
      if (response.affected) {
        return;
      } else {
        throw new EntityDoesNotExistException(errors);
      }
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  async AddUserDeposit(deposit: AddUserDepositDto) {
    try {
      const user = await this.userDbService.findUserById(deposit.userId);
      await this.depositDbService.AddUserDeposit({
        user,
        accountNumber: deposit.accountNumber,
      });
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
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
      this.kafkaClient.emit(topic, payload);
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
    this.kafkaClient.emit(
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

    this.kafkaClient.emit(
      KafkaTopicsConstants.TOPIC_ENROLLMENT_NANTURAL_PERSON_INSERT_STEP,
      bodyEvent,
    );
  }

  async updateCityAndDepartamentByPhoneNumber(
    phoneNumber: string,
    updatelocation: UpdateLocateDto,
  ): Promise<UpdateLocateUserResponse> {
    try {
      return await this.userDbService.updateCityAndDepartamentByPhoneNumber(
        phoneNumber,
        updatelocation,
      );
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MUS021, error);
    }
  }
  async requirementsUser(
    userId: string,
  ): Promise<RequirementsUserResponseData> {
    try {
      const locationRequired = await this.userDbService.locationRequired(
        userId,
      );

      const response: RequirementsUserResponseData = {
        data: { locationRequired },
      };
      return response;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MUS025, error);
    }
  }
}
