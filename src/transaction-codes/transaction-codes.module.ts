import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@dale/logger-nestjs';

import config from '../configuration/configuration';
import { DynamodbModule } from '@dale/aws-nestjs';
import { DYNAMO_TABLE } from '../shared/constants/constants';
import { join } from 'node:path';
import { DatabaseModule } from '../shared/db/db.module';
import { TransactionCodesRepository } from '.';
import { TransactionCodeController } from './controllers';
import { TransactionCodeService } from './services';
import { RolesModule } from '@dale/roles/roles.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      context: 'Roles Module',
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
  controllers: [TransactionCodeController],
  providers: [TransactionCodesRepository, TransactionCodeService],
  exports: [TransactionCodeService],
})
export class TransactionCodesModule {}
