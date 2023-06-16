//Libraries
import { Injectable } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { DynamodbService } from '@dale/aws-nestjs';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

//Entities
import { MonitorMetadata } from '../../../entities/monitor-metadata.entity';

//Data Transfer Objects (DTO)
import { MessageEvent } from '../../../dto/content.dto';

//Error Handling
import { ErrorCodesEnum } from '../../../shared/manage-errors/code-erros/error-codes.enum';

//Utils

@Injectable()
export class DynamoDBService {
  constructor(
    private readonly logger: Logger,
    private readonly dynamoDB: DynamodbService,
  ) {}
  async insertMetadata(
    eventObject: MessageEvent,
    status: boolean,
    result: boolean | string,
    sk: string,
  ): Promise<boolean> {
    const data: MonitorMetadata = {
      PK: eventObject.RS.headerRS.msgId,
      SK: sk,
      CreatedAt: this.getDate(),
      Status: status,
      Result: result,
      Offset: eventObject.Offset,
    };
    try {
      await this.dynamoDB.insertItem<MonitorMetadata>(data);
      this.logger.log(`Item has been successfully inserted in DynamoDB`);
      return true;
    } catch (error) {
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON029, error);
    }
  }

  async findSucceededMetadataByPK(pk: string, sk: string): Promise<any> {
    const result = await this.dynamoDB.findByPK(pk);
    if (result.Items.length !== 0) {
      this.logger.log(`Item has been successfully fetched from DynamoDB`);
      const eventLogItem = result.Items.filter(
        (item: MonitorMetadata) => item.SK == sk && item.Status,
      );
      return eventLogItem;
    }
    this.logger.log(`Item not found in DynamoDB`);
    return [];
  }

  getDate(): string {
    return new Date().toISOString();
  }
}
