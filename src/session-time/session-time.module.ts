import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@dale/logger-nestjs';

import config from '../configuration/configuration';
import { DynamodbModule } from '@dale/aws-nestjs';
import { DYNAMO_TABLE } from '../shared/constants/constants';
import { join } from 'node:path';
import { DatabaseModule } from '../shared/db/db.module';

import { RolesModule } from '../roles';
import { SessionTimeRepository } from '.';
import {
  GetSessionTimeController,
  CreateSessionTimeController,
  UpdateSessionTimeController,
  GetAllSessionTimeController,
} from './controllers';
import {
  GetSessionTimeService,
  CreateSessionTimeService,
  UpdateSessionTimeService,
  GetAllSessionTimeService,
} from './services';

@Module({
  imports: [
    LoggerModule.forRoot({
      context: 'Session Time Module',
    }),
    ConfigModule.forRoot({
      envFilePath: join('..', '..', 'configuration', 'env.config'),
      load: [config],
      isGlobal: true,
    }),
    DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
    DatabaseModule,
    RolesModule,
  ],
  controllers: [
    GetSessionTimeController,
    CreateSessionTimeController,
    UpdateSessionTimeController,
    GetAllSessionTimeController,
  ],
  providers: [
    GetSessionTimeService,
    CreateSessionTimeService,
    UpdateSessionTimeService,
    GetAllSessionTimeService,
    SessionTimeRepository,
  ],
  exports: [],
})
export class SessionTimeModule {}
