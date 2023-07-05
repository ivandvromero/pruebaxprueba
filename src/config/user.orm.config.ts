import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';
import './env/env.config';
import * as AWSXRay from 'aws-xray-sdk';
const isAWS = process.env.CLOUD_SERVICE_PROVIDER?.toUpperCase() === 'AWS';
const hasSSL = process.env.DB_SSL_ENABLED?.toLowerCase() === 'true';

export type ConnectionOptions = PostgresConnectionOptions &
  TypeOrmModuleOptions & { seeds: string[] };

const overwriteConfig = {};

if (isAWS) {
  const configAWS = {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    driver: AWSXRay.capturePostgres(require('pg')),
    password: fs.readFileSync('userToken').toString(),
  };
  Object.assign(overwriteConfig, configAWS);
}

if (hasSSL) {
  const configSSL = {
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
  Object.assign(overwriteConfig, configSSL);
}

export const userConfig = (): ConnectionOptions => ({
  type: 'postgres',
  name: 'user',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_USER_USERNAME,
  password: process.env.TYPEORM_USER_PASSWORD,
  database: process.env.TYPEORM_USER_DATABASE,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development' ? true : false,
  entities: [__dirname + '/../db/**/*.entity.[tj]s'],
  migrations: [__dirname + '/../db/migration/**/*.[tj]s'],
  seeds: [__dirname + '/../db/seeds/**/*.[tj]s'],
  ssl: false,
  extra: {
    connectionLimit: parseInt(process.env.DB_POOL_SIZE, 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIME_OUT, 10),
  },
  keepConnectionAlive: true,
  ...overwriteConfig,
});

export const config = userConfig();
