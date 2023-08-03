import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@dale/logger-nestjs';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { ErrorCustomizer } from '../../utils/customize-error';
import { enviroments } from '../../config/env.config';
import { MambuService } from './mambu.service';
import configuration from '../../config/service-configuration';
import * as retryStrategy from 'node-redis-retry-strategy';

@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({ context: 'Mambu Service' }),
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        MAMBU_URL: Joi.string().required(),
        MAMBU_API_KEY: Joi.string().required(),
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
  ],
  providers: [MambuService, ErrorCustomizer],
  exports: [MambuService],
})
export class MambuModule {}
