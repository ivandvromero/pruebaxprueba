import { Injectable } from '@nestjs/common';
import {
  SqsSendEventsService,
  SQSSendEventInterface,
  SQSSendEventResponseInterface,
} from 'poc_eventos_sqs';

import { EventFavoriteSQS } from '../constants/event-log';
import { HeaderDTO } from '../dto/header.dto';
import {
  CreateFavoriteDto,
  ResultFavorite,
} from '../../modules/user-favorite/dto/create-favorite.dto';
import { toIsoString } from '../../providers/sqs-logs/helpers/date-to-iso-string';

@Injectable()
export class EventLogService {
  result = {} as SQSSendEventResponseInterface;
  data = {} as SQSSendEventInterface;
  sqsService = new SqsSendEventsService(process.env.SQS_TRANSACTION_LOG);

  async sendDebitTransferSQS(
    event: CreateFavoriteDto,
    headers: HeaderDTO,
    resultFavorite: ResultFavorite,
  ): Promise<SQSSendEventResponseInterface> {
    const { code, message, action } = resultFavorite;
    this.data.version = EventFavoriteSQS.VERSION;
    this.data.eventCode = EventFavoriteSQS.EVENTCODE;
    this.data.eventMnemonic = EventFavoriteSQS.EVENTMNEMONIC;
    this.data.eventName = EventFavoriteSQS.EVENTNAME;
    this.data.timestamp = toIsoString(new Date());
    this.data.details = [
      {
        key: 'code',
        value: code,
      },
      {
        key: 'mesage',
        value: message,
      },
      {
        key: 'origin_cellphone',
        value: event.originCellphone,
      },

      {
        key: 'fav_name',
        value: event.favoriteAlias,
      },
      {
        key: 'fav_tel',
        value: event.phoneNumber,
      },
      {
        key: 'action',
        value: action,
      },
    ];
    this.data.source = { userAgent: headers.UserAgent };
    this.data.audit = {
      application: EventFavoriteSQS.APPLICATION,
      clientId: event.clientId,
      clientIdType: event.clientIdType,
      channel: EventFavoriteSQS.CHANNEL,
      transactionId: headers.TransactionId,
      requestId: headers.TransactionId,
      ipAddress: headers.IpAddress,
      sessionId: headers.SessionId,
    };
    this.data.result = code === '0' ? true : false;
    try {
      this.result = await this.sqsService.sendMessageToSqs(this.data);
      console.log(
        'sendMessageToSqs Result: ==> ' + JSON.stringify(this.result),
      );
      return this.result;
    } catch (e) {
      console.log('sendMessageToSqs Error: ==> ' + JSON.stringify(e));
    }
  }
}
