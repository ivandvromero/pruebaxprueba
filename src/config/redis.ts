//Libraries
import * as redisStore from 'cache-manager-redis-store';

//Types
import type { RedisClientOptions } from 'redis';

//Configurations
import configuration from './service-configuration';

export const REDIS_CONFIG: RedisClientOptions = {
  store: redisStore,
  host: configuration().redis.host,
  port: configuration().redis.port,
  ttl: configuration().redis.ttl,
  ...(configuration().redis.tls_enable === 'true'
    ? {
        password: configuration().redis.auth_token,
        tls: { servername: configuration().redis.host },
      }
    : {}),
};
