//Libraries
import { Logger } from '@dale/logger-nestjs';
import { catchError, lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

//Constants
import { KafkaTopicsConstants } from '../../../constants/api';

//Data Transfer Objects (DTO)
import {
  Key,
  DateInfo,
  DaleNotificationPayload,
} from '../dto/dale-notification.dto';
import { MessageEvent } from '../../../dto/content.dto';

//Error Handling
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { ErrorCodesEnum } from '../../../shared/manage-errors/code-erros/error-codes.enum';

//Utils
import { transformDate, transformTime } from '../../../utils/transform-class';

//Services
import { DynamoDBService } from './dynamodb.service';

@Injectable()
export class DaleNotificationService {
  constructor(
    @Inject('KAFKA_CLIENT') private kafkaService: ClientProxy,
    private logger: Logger,
    private readonly dynamoDBService: DynamoDBService,
  ) {}
  async sendSmsNotification(
    eventObject: MessageEvent,
    ext: string,
    phone: string,
    resend: boolean,
    notificationCode: string,
    keys: Key[],
  ) {
    const payload: DaleNotificationPayload = {
      UserId: eventObject.RS.headerRS.msgId,
      Message: ' ',
      NotificationCode: notificationCode,
      SMSType: 'Transactional',
      NotificationTypeCode: NotificationTypeEnum.SMS,
      Resend: resend,
      Recipient: `+${ext}${phone}`,
      keys: keys,
    };
    const dataDynamoDB = await this.dynamoDBService.findSucceededMetadataByPK(
      eventObject.RS.headerRS.msgId,
      `SMS+${ext}${phone}`,
    );
    if (dataDynamoDB.length === 0) {
      const res = await lastValueFrom(
        this.kafkaService
          .emit(KafkaTopicsConstants.NOTIFICATION_SMS, payload)
          .pipe(
            catchError(async (err) => {
              await this.dynamoDBService.insertMetadata(
                eventObject,
                false,
                JSON.stringify(err),
                `SMS+${ext}${phone}`,
              );
              throw new InternalServerExceptionDale(ErrorCodesEnum.MON021, err);
            }),
          ),
      );
      await this.dynamoDBService.insertMetadata(
        eventObject,
        true,
        true,
        `SMS+${ext}${phone}`,
      );
      this.logger.log(`SMS notification has been successfully send`);
      return res;
    }
  }

  getDateInformation(date: string): DateInfo {
    const transactionDate = new Date(date);
    const transactionDateTransform = transformDate(transactionDate);
    const year = transactionDateTransform.substring(0, 4);
    const month = transactionDateTransform.substring(4, 6);
    const day = transactionDateTransform.substring(6);
    const transactionDateTransformTime = transformTime(transactionDate);
    const hourNumber = transactionDate.getHours();
    const hour = hourNumber < 10 ? '0' + hourNumber : hourNumber.toString();
    const minute = transactionDateTransformTime.substring(2, 4);
    return { year, month, day, hour, minute };
  }

  getSmsKeys(amount: number, date: DateInfo, name?: string): Key[] {
    const keys: Key[] = [
      {
        Key: '#Name',
        Value: name || '',
      },
      {
        Key: '#Amount',
        Value: `$${new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
        }).format(amount)}`,
      },
      {
        Key: '#Date',
        Value: `${date.day}/${date.month}/${date.year}`,
      },
      {
        Key: '#Time',
        Value: `${date.hour}:${date.minute}`,
      },
    ];
    return keys;
  }
}
