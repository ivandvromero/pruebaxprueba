//Libraries
import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';

//Types
import type { RedisClientOptions } from 'redis';

//Logs
import { LoggerModule } from '@dale/logger-nestjs';

//Services
import { UserService } from './user.service';

//Configurations
import { REDIS_CONFIG } from '../../config/redis';

//Secrets Managers
import { SecretsManagerService } from '@dale/aws-nestjs';
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';

@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({ context: 'user service' }),
    CacheModule.register<RedisClientOptions>({ ...REDIS_CONFIG }),
  ],
  controllers: [],
  providers: [UserService, SecretsManager, SecretsManagerService],
  exports: [UserService],
})
export class UserModule {}
