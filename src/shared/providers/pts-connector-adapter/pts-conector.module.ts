import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@dale/logger-nestjs';

import config from '../../../configuration/configuration';
import { join } from 'node:path';
import { PtsConnector } from './service/pts-connector';
import { PtsTokenManager } from './service/token-manager.service';
import { REDIS_CONFIG } from '../../../shared/config/redis-config';
import type { RedisClientOptions } from 'redis';
import { AxiosAdapter } from '@dale/http-adapters/axios-adapter';

@Module({
  imports: [
    LoggerModule.forRoot({
      context: 'Pts connector adapter',
    }),
    ConfigModule.forRoot({
      envFilePath: join('..', '..', 'configuration', 'env.config'),
      load: [config],
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({ ...REDIS_CONFIG }),
  ],
  providers: [PtsConnector, PtsTokenManager, AxiosAdapter],
  controllers: [],
  exports: [PtsConnector, PtsTokenManager],
})
export class PtsConnectorModule {}
