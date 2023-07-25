import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@dale/logger-nestjs';

import config from '../configuration/configuration';
import { DynamodbModule } from '@dale/aws-nestjs';
import { DYNAMO_TABLE } from '../shared/constants/constants';
import { join } from 'node:path';
import { DatabaseModule } from '../shared/db/db.module';
import { CreateNotificationService } from './services/create-notification.service';
import { GetNotificationsService } from './services/get-notifications.service';
import { UpdateNotificationWithoutIdService } from './services/update-notification-date-without-id.service';
import { NotificationsGateway } from './gateways/notifications.gateways';
import { Auth0Module } from '@dale/auth/auth0.module';
import { ClientManagerGateway } from './services/client-manager-gateway.service';
import { REDIS_CONFIG } from '../shared/config/redis-config';
import type { RedisClientOptions } from 'redis';
import { NotificationsRepositoryModule } from './repositories/notifications/notifications-repository.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      context: 'Notifications Module',
    }),
    ConfigModule.forRoot({
      envFilePath: join('..', '..', 'configuration', 'env.config'),
      load: [config],
      isGlobal: true,
    }),
    DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
    CacheModule.register<RedisClientOptions>({ ...REDIS_CONFIG }),
    DatabaseModule,
    Auth0Module,
    NotificationsRepositoryModule,
  ],
  providers: [
    GetNotificationsService,
    CreateNotificationService,
    UpdateNotificationWithoutIdService,
    NotificationsGateway,
    ClientManagerGateway,
  ],
  exports: [CreateNotificationService, UpdateNotificationWithoutIdService],
})
export class NotificationsModule {}
