import type { RedisClientOptions } from 'redis';
import { REDIS_CONFIG } from './redis-config';

export const REDIS_CONFIG_AUHT0: RedisClientOptions = {
  ...REDIS_CONFIG,
};
delete REDIS_CONFIG_AUHT0.ttl;
