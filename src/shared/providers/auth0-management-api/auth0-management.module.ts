import { CacheModule, Module } from '@nestjs/common';
import { Auth0Connector } from './connector/auth0-connector';
import { Auth0Service } from './auth-services/auth0-service';
import { AxiosAdapter } from '@dale/http-adapters/axios-adapter';
import { ConfigModule } from '@nestjs/config';
import config from '../../../configuration/configuration';
import { REDIS_CONFIG } from '../../../shared/config/redis-config';
import type { RedisClientOptions } from 'redis';
import { SecretsManager } from '../../../shared/secrets-manager/secrets-manager';
import { SecretsManagerService } from '@dale/aws-nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'dev.env',
      load: [config],
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({
      ...REDIS_CONFIG,
    }),
  ],
  exports: [Auth0Service],
  controllers: [],
  providers: [
    Auth0Connector,
    Auth0Service,
    AxiosAdapter,
    SecretsManager,
    SecretsManagerService,
  ],
})
export class Auth0ManagementModule {}
