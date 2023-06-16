//Libraries
import { Injectable } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

//Error Handling
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

//Transform Data
import { mapErrorChildren } from '../../utils/transform-class';

//Enums
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';

//Providers
import { ProviderContext } from '../../providers/context/provider-context';
import { DynamoDBService } from '../../providers/dale/services/dynamodb.service';

//Data Transfer Objects (DTO)
import { MessageEvent } from '../../dto/content.dto';

//Utils
import { sendMessage } from '../../utils/aws-sqs';

@Injectable()
export class MonitorService {
  constructor(
    private readonly logger: Logger,
    private readonly providerContext: ProviderContext,
    private readonly dynamoDBService: DynamoDBService,
  ) {}
  async validateMessageEvent(eventObject): Promise<MessageEvent> {
    const dto = plainToInstance(MessageEvent, eventObject);
    const errors: ValidationError[] = await validate(dto);
    if (errors.length) {
      const error = mapErrorChildren(errors);
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON001, error);
    }
    return eventObject;
  }
  async getTrama(eventObject: MessageEvent): Promise<string> {
    const dataDynamoDB = await this.dynamoDBService.findSucceededMetadataByPK(
      eventObject.RS.headerRS.msgId,
      'TRAMA',
    );
    if (dataDynamoDB.length === 0) {
      this.providerContext.setStrategy(eventObject.CFO.general.transactionType);
      const trama = await this.providerContext.generateStructure(eventObject);
      await sendMessage({ MessageBody: trama });
      this.logger.log(`Message has been successfully send to queue SQS`);

      await this.dynamoDBService.insertMetadata(
        eventObject,
        true,
        true,
        'TRAMA',
      );
      return trama;
    }
  }
}
