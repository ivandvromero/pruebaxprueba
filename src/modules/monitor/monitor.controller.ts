import { Controller, Post } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { Logger } from '@dale/logger-nestjs';
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';
import { KafkaTopicsConstants, kafkaRetries } from '../../constants/api';
import {
  Ctx,
  Payload,
  EventPattern,
  KafkaContext,
} from '@nestjs/microservices';
import {
  BadRequestExceptionDale,
  CustomException,
} from '@dale/manage-errors-nestjs';
import { DynamoDBService } from '../../providers/dale/services/dynamodb.service';
import { MessageEvent } from '../../dto/content.dto';

@Controller('monitor')
export class MonitorController {
  constructor(
    private logger: Logger,
    private readonly monitorService: MonitorService,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  private currentRetry = 0;
  @EventPattern(KafkaTopicsConstants.PTS_TOPIC_PTS)
  async getKafkaEvent(
    @Ctx() context: KafkaContext,
    @Payload() eventObject: MessageEvent,
  ) {
    try {
      const [contextObject] = context.getArgs();
      const incomingMessage = await this.monitorService.validateMessageEvent(
        eventObject,
      );
      incomingMessage.Offset = contextObject.offset;
      const trama = await this.monitorService.getTrama(incomingMessage);
      return trama;
    } catch (error) {
      const [contextObject] = context.getArgs();
      this.logger.error(
        `Error at controller from kafka topic ${KafkaTopicsConstants.PTS_TOPIC_PTS} in the attemp ${this.currentRetry}`,
        error.response ? error.response.error : error.message,
        error.stack,
      );
      await this.dynamoDBService.insertMetadata(
        eventObject,
        false,
        error.response ? JSON.stringify(error) : error.message,
        'TRAMA',
      );
      if (this.currentRetry < kafkaRetries) {
        this.currentRetry++;
        if (error instanceof CustomException) {
          throw error;
        }
        throw new BadRequestExceptionDale(ErrorCodesEnum.MON000, error);
      } else {
        this.logger.log(`Offset: ${contextObject.offset}`);
        this.currentRetry = 0;
      }
    }
  }

  @Post()
  async getKafkaEventx(
    //@Ctx() context: KafkaContext,
    @Payload() eventObject: MessageEvent,
  ) {
    try {
      //const [contextObject] = context.getArgs();
      const incomingMessage = await this.monitorService.validateMessageEvent(
        eventObject,
      );
      //incomingMessage.Offset = contextObject.offset;
      const trama = await this.monitorService.getTrama(incomingMessage);
      return trama;
    } catch (error) {
      //const [contextObject] = context.getArgs();
      this.logger.error(
        `Error at controller from kafka topic ${KafkaTopicsConstants.PTS_TOPIC_PTS} in the attemp ${this.currentRetry}`,
        error.response ? error.response.error : error.message,
        error.stack,
      );
      await this.dynamoDBService.insertMetadata(
        eventObject,
        false,
        error.response ? JSON.stringify(error) : error.message,
        'TRAMA',
      );
      if (this.currentRetry < kafkaRetries) {
        this.currentRetry++;
        if (error instanceof CustomException) {
          throw error;
        }
        throw new BadRequestExceptionDale(ErrorCodesEnum.MON000, error);
      } else {
        //this.logger.log(`Offset: ${contextObject.offset}`);
        this.currentRetry = 0;
      }
    }
  }
}
