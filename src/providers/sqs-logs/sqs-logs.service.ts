import { ErrorCodesEnum } from 'src/shared/code-erros/error-codes.enum';
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { Injectable } from '@nestjs/common';
import {
  SqsSendEventsService,
  SQSSendEventInterface,
  SQSSendEventResponseInterface,
} from 'poc_eventos_sqs';
import { transformMessageLog } from './utils/transform-data';
import { CreateUserLogEventDto } from './dto/create-user-log-event.dto';
import { Logger } from '@dale/logger-nestjs';
import { SqsLogTypeEnum } from './enums/log-type.enum';
import { toIsoString } from './helpers/date-to-iso-string';
import { ConfigurationService } from '../dale/services/configuration.service';

@Injectable()
export class SqsLogsService {
  message = {} as SQSSendEventInterface;
  SQSMessage = new SqsSendEventsService(process.env.SQS_TRANSACTION_LOG);

  constructor(
    private readonly logger: Logger,
    private readonly configurationService: ConfigurationService,
  ) {}

  async publicLogSqs(
    message: SQSSendEventInterface,
  ): Promise<SQSSendEventResponseInterface> {
    {
      try {
        this.logger.log(`Begin publicLogSqs`, JSON.stringify(message));
        const data: SQSSendEventResponseInterface =
          await this.SQSMessage.sendMessageToSqs(message);
        this.logger.log(`End publicLogSqs`, JSON.stringify(data));
        return data;
      } catch (error) {
        this.logger.error(`Error in publicLogSqs`, JSON.stringify(error));
        throw new InternalServerExceptionDale(
          ErrorCodesEnum.MUS018,
          error.message,
        );
      }
    }
  }

  async sendMessageLog<T>(
    dataResponse: CreateUserLogEventDto<T>,
    type: SqsLogTypeEnum,
    result: boolean,
  ): Promise<void> {
    try {
      const optionsData = transformMessageLog(dataResponse, type);
      this.logger.log(
        'Start call configuration service for documentType',
        dataResponse.body?.documentType,
      );
      const clientType: string = dataResponse.body?.documentType
        ? await this.configurationService.getDocumentTypeNameById(
            dataResponse.body.documentType.toString(),
          )
        : '';
      this.logger.log('Configuration service reponse: ', clientType);
      await this.publicLogSqs({
        version: optionsData.version,
        eventCode: optionsData.eventCode,
        eventMnemonic: optionsData.eventMnemonic,
        eventName: optionsData.eventName,
        timestamp: toIsoString(new Date()),
        details: optionsData.details,
        source: {
          userAgent: dataResponse.headers['user-agent'] || '',
        },
        audit: {
          application: 'DALE 2.0',
          clientId: dataResponse.body?.documentNumber || '',
          clientIdType: clientType,
          channel: 'DALEAPP',
          transactionId: dataResponse.headers.transactionId,
          requestId: dataResponse.data?.enrollmentId,
          ipAddress: dataResponse.headers.ipAddress,
          sessionId: dataResponse.data?.enrollmentId,
        },
        result,
      });
    } catch (error) {
      this.logger.error(`Error in sendMessageLog`, JSON.stringify(error));
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(
        ErrorCodesEnum.MUS018,
        error.message,
      );
    }
  }
}
