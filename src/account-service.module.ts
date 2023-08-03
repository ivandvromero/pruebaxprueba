import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@dale/logger-nestjs';

import { AccountsModule } from './modules/accounts/accounts.module';
import { ServiceModule } from './modules/meta-service/meta-service.module';
import serviceConfiguration from './config/service-configuration';
import { enviroments } from './config/env.config';
import {
  ALL_EXCEPTION_FILTERS_FOR_PROVIDER,
  ManageErrorsModule,
} from '@dale/manage-errors-nestjs';
import { errorCodesLocal } from './shared/code-errors/error-codes.local';
import { DaleModule } from './providers/dale/dale.module';
import { RedisModule } from './db/redis/redis.module';
import { ContextProviderModule } from './providers/context-provider/context-provider.module';
import { ModuleCRM } from './providers/crm/crm.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [serviceConfiguration],
      validationSchema: Joi.object({
        // service
        NODE_ENV: Joi.string().required(),
        SERVICE_TYPE: Joi.string().required(),
        SERVICE_NAME: Joi.string().required(),
        SERVICE_PORT: Joi.string().required(),
        CLOUD_SERVICE_PROVIDER: Joi.string().required(),
        ENABLE_AUDIT: Joi.string().required(),
        // aws
        AWS_REGION: Joi.string().required(),
        AWS_XRAY_DAEMON_ADDRESS: Joi.string().required(),
        CERTIFICATE_PRIVATE_KEY: Joi.string().required(),
        PUBLIC_CERTIFICATE: Joi.string().required(),
        // pdf generate service
        PDF_GENERATE_SERVICE_URL: Joi.string().required(),
      }),
    }),
    AccountsModule,
    ServiceModule,
    RedisModule,
    DaleModule,
    ModuleCRM,
    LoggerModule.forRoot({ context: 'Account Service' }),
    ManageErrorsModule.forRoot({
      errorCodesLocal: errorCodesLocal,
      nameService: 'Account Service',
    }),
    ContextProviderModule,
  ],
  providers: [...ALL_EXCEPTION_FILTERS_FOR_PROVIDER],
})
export class AccountServiceModule {}
