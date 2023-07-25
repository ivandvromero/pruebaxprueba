import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DynamodbModule } from '@dale/aws-nestjs';
import { LoggerModule } from '@dale/logger-nestjs';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_CLIENT_CONFIG } from '../../config/kafka';
import { DynamoDBService } from './services/dynamodb.service';
import { ConfigurationService } from './services/configuration.service';
import { DaleNotificationService } from './services/dale-notification.service';

@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({ context: 'dale notification module' }),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
    DynamodbModule.forRoot({ tableName: 'Monitor' }),
  ],
  exports: [DaleNotificationService, ConfigurationService, DynamoDBService],
  providers: [DaleNotificationService, ConfigurationService, DynamoDBService],
})
export class DaleModule {}
