//Libraries
import { Injectable } from '@nestjs/common';

//Contexts
import { ProviderEventlogContext } from '../../providers/context-eventlog/eventlog-context';

import { EventSQSService } from '../../providers/context-eventlog/event-log/event-log-service';

//Data Transfer Objects (DTO)
import { MessageEvent } from '../../dto/content.dto';

//Providers
import { DynamoDBService } from '../../providers/dale/services/dynamodb.service';

@Injectable()
export class EventLogService {
  constructor(
    private readonly eventLogService: EventSQSService,
    private readonly dynamoDBService: DynamoDBService,
    private readonly providerContext: ProviderEventlogContext,
  ) {}
  async getEventLog(eventObject: MessageEvent) {
    const dataDynamoDB = await this.dynamoDBService.findSucceededMetadataByPK(
      eventObject.RS.headerRS.msgId,
      'EVENT_LOG',
    );
    if (dataDynamoDB.length === 0) {
      this.providerContext.setStrategy(eventObject.CFO.general.transactionType);

      const eventLogList = await this.providerContext.generateEventLog(
        eventObject,
      );

      const resultSendEventSQS = await this.eventLogService.sendEventSQS(
        eventLogList,
      );
      await this.dynamoDBService.insertMetadata(
        eventObject,
        true,
        true,
        'EVENT_LOG',
      );
      return resultSendEventSQS;
    }
  }
}
