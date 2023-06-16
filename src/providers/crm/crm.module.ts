import { CacheModule, Module } from '@nestjs/common';
import { LoggerModule } from '@dale/logger-nestjs';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { CrmService } from './crm.service';
import { enviroments } from '../../config/env/env.config';
import configuration from '../../config/service-configuration';
import { SecretsManagerService } from '@dale/aws-nestjs';
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';
import { REDIS_CONFIG } from '../../config/redis';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({ context: 'crm service' }),
    CacheModule.register<RedisClientOptions>({ ...REDIS_CONFIG }),
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        // crm
        CRM_SERVICE_URL: Joi.string().required(),
        CRM_USERNAME: Joi.string().required(),
        CRM_PASSWORD: Joi.string().required(),
      }),
    }),
  ],
  providers: [CrmService, ConfigService, SecretsManager, SecretsManagerService],
  exports: [CrmService],
})
export class CrmModule {}
