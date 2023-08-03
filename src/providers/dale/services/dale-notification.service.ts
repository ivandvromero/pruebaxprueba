import { KafkaTopicsConstants } from '../../../modules/accounts/constants/api';
import { ErrorCodesEnum } from './../../../shared/code-errors/error-codes.enum';
import { NotificationTypeEnum } from './../../enums/notification-type.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DaleNotificationPayload } from '../dto/dale-notification.dto';
import { catchError, lastValueFrom } from 'rxjs';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

@Injectable()
export class DaleNotificationService {
  constructor(@Inject('KAFKA_CLIENT') private kafkaService: ClientKafka) {}
  async sendSmsNotification(
    id: string,
    ext: string,
    phone: string,
    resend: boolean,
  ) {
    const payload: DaleNotificationPayload = {
      UserId: id,
      Message: '',
      NotificationCode: '003',
      SMSType: 'Transactional',
      NotificationTypeCode: NotificationTypeEnum.SMS,
      Resend: resend,
      Recipient: `+${ext}${phone}`,
      keys: [{ Key: '', Value: '' }],
    };
    const res = await lastValueFrom(
      this.kafkaService
        .emit(KafkaTopicsConstants.NOTIFICATION_SMS, payload)
        .pipe(
          catchError((err) => {
            throw new InternalServerExceptionDale(ErrorCodesEnum.ACN001, err);
          }),
        ),
    );
    return res;
  }
}
