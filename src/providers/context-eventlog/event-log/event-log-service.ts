import { Injectable } from '@nestjs/common';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { SqsSendEventsService, SQSSendEventInterface } from 'poc_eventos_sqs';
import { ErrorCodesEnum } from '../../../shared/manage-errors/code-erros/error-codes.enum';

@Injectable()
export class EventSQSService {
  async sendEventSQS(events): Promise<any> {
    try {
      let data = {} as SQSSendEventInterface;
      const sqsService = new SqsSendEventsService(
        process.env.SQS_TRANSACTION_LOG,
      );
      const results = [];
      for (const key in events) {
        const element = events[key];
        data = element;
        results.push(await sqsService.sendMessageToSqs(data));
      }
      console.log('results :>> ', results);
      return results;
    } catch (e) {
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON030, e);
    }
  }
}
