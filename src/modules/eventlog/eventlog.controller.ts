//Libraries
import {
  Ctx,
  Payload,
  EventPattern,
  KafkaContext,
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';

//Enums
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';

//Error Handling
import {
  BadRequestExceptionDale,
  CustomException,
} from '@dale/manage-errors-nestjs';

//Services
import { EventLogService } from './eventlog.service';

//Constants
import { KafkaTopicsConstants, kafkaRetries } from '../../constants/api';

//Data Transfer Objects (DTO)
import { MessageEvent } from '../../dto/content.dto';

//Providers
import { DynamoDBService } from '../../providers/dale/services/dynamodb.service';

@Controller('event-log')
export class EventLogController {
  constructor(
    private logger: Logger,
    private readonly dynamoDBService: DynamoDBService,
    private readonly eventLogService: EventLogService,
  ) {}
  private retries = 0;
  @EventPattern(KafkaTopicsConstants.PTS_TOPIC_PTS)
  async getKafkaEvent(
    @Ctx() context: KafkaContext,
    @Payload() eventObject: MessageEvent,
  ) {
    try {
      this.logger.log(`getKafkaEvent from event log`);
      const [contextObject] = context.getArgs();
      eventObject.Offset = contextObject.offset;
      const resultEventLog = await this.eventLogService.getEventLog(
        eventObject,
      );
      return resultEventLog;
    } catch (error) {
      const [contextObject] = context.getArgs();
      this.logger.error(
        `Error at controller from kafka topic  in the attemp ${this.retries}`,
        error.response ? error.response.error : error.message,
        error.stack,
      );
      await this.dynamoDBService.insertMetadata(
        eventObject,
        false,
        error.response ? JSON.stringify(error) : error.message,
        'EVENT_LOG',
      );
      if (this.retries < kafkaRetries) {
        this.retries++;
        if (error instanceof CustomException) {
          throw error;
        }
        throw new BadRequestExceptionDale(ErrorCodesEnum.MON000, error);
      } else {
        this.logger.log(`Offset: ${contextObject.offset}`);
        this.retries = 0;
      }
    }
  }
}
