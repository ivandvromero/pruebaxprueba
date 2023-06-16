import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@dale/logger-nestjs';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import type { RedisClientOptions } from 'redis';
import { REDIS_CONFIG } from '../../config/redis';
import { enviroments } from 'src/config/env/env.config';
import { SecretsManagerService } from '@dale/aws-nestjs';
import configuration from '../../config/service-configuration';
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';
import { CardService } from './card.service';

@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({ context: 'card service' }),
    CacheModule.register<RedisClientOptions>({ ...REDIS_CONFIG }),
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [
    CardService,
    ConfigService,
    SecretsManager,
    SecretsManagerService,
  ],
  exports: [CardService],
})
export class CardModule {}
