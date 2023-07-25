import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@dale/logger-nestjs';

import config from '../../configuration/configuration';
import { DynamodbModule } from '@dale/aws-nestjs';
import { DYNAMO_TABLE } from '../../shared/constants/constants';
import { join } from 'node:path';
import { UseWorkBalancerService } from './modules/services/use-work-balancer.service';
import { Auth0ManagementModule } from 'src/shared/providers/auth0-management-api/auth0-management.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      context: 'Monetary Adjustment Module',
    }),
    ConfigModule.forRoot({
      envFilePath: join('..', '..', 'configuration', 'env.config'),
      load: [config],
      isGlobal: true,
    }),
    Auth0ManagementModule,
    DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
  ],
  exports: [UseWorkBalancerService],
  providers: [UseWorkBalancerService],
  controllers: [],
})
export class UserWorkBalancerModule {}
