import { LoggerModule } from '@dale/logger-nestjs';
import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { enviroments } from '../../config/env.config';
import configuration from '../../config/service-configuration';
import { AdlService } from './adl.service';
import { REDIS_CONFIG } from '../../config/redis';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        ADL_AUGUSTA_API: Joi.string().required(),
        ADL_AUGUSTA_API_KEY: Joi.string().required(),
      }),
    }),
    LoggerModule.forRoot({ context: 'ADL Service' }),
    CacheModule.register(REDIS_CONFIG),
  ],
  providers: [AdlService],
  exports: [AdlService],
})
export class AdlModule {}
