//Libraries
import { HttpModule } from '@nestjs/axios';
import { CacheModule, Inject, Module, CACHE_MANAGER } from '@nestjs/common';

//Types
import type { RedisClientOptions } from 'redis';

//Logs
import { LoggerModule } from '@dale/logger-nestjs';

//Services
import { EnrollmentNaturalPersonService } from './enrollment-np.service';

//Configurations
import { REDIS_CONFIG } from '../../config/redis';

//Secrets Managers
import { SecretsManagerService } from '@dale/aws-nestjs';
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';

@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({ context: 'enrollment service' }),
    CacheModule.register<RedisClientOptions>({ ...REDIS_CONFIG }),
  ],
  controllers: [],
  providers: [
    SecretsManager,
    SecretsManagerService,
    EnrollmentNaturalPersonService,
  ],
  exports: [EnrollmentNaturalPersonService],
})
export class EnrollmentNaturalPersonModule {
  constructor(@Inject(CACHE_MANAGER) cacheManager) {
    const client = cacheManager.store.getClient();
    client.on('connect', () => {
      console.log('redis client is connecting to server...');
    });
    client.on('ready', () => {
      console.log('redis client is ready');
    });
    client.on('end', () => {
      console.log('redis client connection closed');
    });
    client.on('error', (error) => {
      console.error(error);
    });
  }
}
