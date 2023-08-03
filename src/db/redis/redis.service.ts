import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async setCache(keyValue: string, valueData: any, duration = 3600) {
    return await this.cacheManager.set(keyValue, valueData, { ttl: duration });
  }

  async getCache(keyValue: string) {
    return await this.cacheManager.get(keyValue);
  }

  async getTtl(keyValue: string) {
    return await this.cacheManager.ttl(keyValue);
  }

  async deleteCache(keyValue: string) {
    return await this.cacheManager.del(keyValue);
  }
}
