import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import * as retryStrategy from 'node-redis-retry-strategy';

export const REDIS_CONFIG: RedisClientOptions = {
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: retryStrategy({
    allow_to_start_without_connection: true,
  }),
  retryAttempts: 10,
  retryDelay: 3000,
  ttl: 86400,
  ...(process.env.REDIS_TLS_ENABLED === 'true'
    ? {
        auth_pass: process.env.REDIS_AUTH_TOKEN,
        tls: { servername: process.env.REDIS_HOST },
      }
    : {}),
};
