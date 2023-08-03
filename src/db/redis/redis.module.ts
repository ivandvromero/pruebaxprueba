import { CacheModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { HttpModule } from '@nestjs/axios';

import { REDIS_CONFIG } from '../../config/redis';

@Module({
  imports: [HttpModule, CacheModule.register(REDIS_CONFIG)],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
