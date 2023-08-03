import { LoggerModule } from '@dale/logger-nestjs';
import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import * as Joi from 'joi';
import * as retryStrategy from 'node-redis-retry-strategy';

import { enviroments } from '../../config/env.config';
import configuration from '../../config/service-configuration';
import { PtsService } from './pts.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        PTS_API_URL: Joi.string().required(),
        PTS_USER: Joi.string().required(),
        PTS_PWD: Joi.string().required(),
        PTS_REFRESH_TOKEN: Joi.string().required(),
      }),
    }),
    CacheModule.register({
      store: redisStore,
      host: configuration().redis.host,
      port: configuration().redis.port,
      ttl: configuration().redis.ttl,
      ...(configuration().redis.tls_enable === 'true'
        ? {
            auth_pass: configuration().redis.auth_token,
            tls: { servername: configuration().redis.host },
          }
        : {}),
      retry_strategy: retryStrategy({
        allow_to_start_without_connection: true,
      }),
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    LoggerModule.forRoot({ context: 'PTS Service' }),
  ],
  providers: [PtsService],
  exports: [PtsService, CacheModule],
})
export class PtsModule {}
