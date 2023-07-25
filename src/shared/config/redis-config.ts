import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

export const REDIS_CONFIG: RedisClientOptions = {
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ...(process.env.REDIS_TLS_ENABLED === 'true'
    ? {
        password: process.env.REDIS_AUTH_TOKEN,
        tls: { servername: process.env.REDIS_HOST },
      }
    : {}),
};

export enum TTL_REDIS_CONFIG {
  AUTH_TOKEN_M2M_TIME = 36000,
  PTS_AUTH_TOKEN_TIME = 3600,
  NOTIFICATIONS_TIME = 0,
}
