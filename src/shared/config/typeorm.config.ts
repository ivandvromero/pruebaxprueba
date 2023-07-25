import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import '../../configuration/env.config';
import * as fs from 'fs';
import * as AWSXRay from 'aws-xray-sdk';
import {
  MonetaryAdjustmentEntityOrm,
  UpdateAdjustmentRegister,
} from '@dale/monetary-adjustment/repositories/activity-update/update-adjustment-register.entity';
import { FileMassiveMonetaryAdjustment } from '@dale/monetary-adjustment/repositories/file-monetary-adjustment/massive-monetary-adjustment-file.entity';
import { RoleEntity } from '@dale/roles/repositories/role/role.entity';
import { DataSource } from 'typeorm';
import { HistoricalEntity } from '../../peps/repository/historical.entity';
import { NotificationEntity } from '@dale/notifications/repositories/notifications/notifications.entity';
import { TransactionCodesEntity } from '@dale/transaction-codes/index';
import { SessionTimeEntity } from '@dale/session-time/repositories/session-time/session-time.entity';

const isAWS = process.env.CLOUD_SERVICE_PROVIDER?.toUpperCase() === 'AWS';
const hasSSL = process.env.DB_SSL_ENABLED?.toLowerCase() === 'true';

export type ConnectionOptions = PostgresConnectionOptions &
  TypeOrmModuleOptions & { seeds: string[] };

const overwriteConfig = {};

if (isAWS) {
  const configAWS = {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    driver: AWSXRay.capturePostgres(require('pg')),
    password: fs.readFileSync('backofficeToken').toString(),
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

export const backofficeConfig = (): ConnectionOptions => ({
  type: 'postgres',
  name: 'backoffice',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_BACKOFFICE_USERNAME,
  password: process.env.TYPEORM_USER_PASSWORD,
  database: process.env.TYPEORM_BACKOFFICE_DATABASE,
  synchronize: false,
  //logging: process.env.NODE_ENV === 'development' ? true : false,
  logging: false,
  entities: [
    MonetaryAdjustmentEntityOrm,
    FileMassiveMonetaryAdjustment,
    RoleEntity,
    TransactionCodesEntity,
    UpdateAdjustmentRegister,
    HistoricalEntity,
    NotificationEntity,
    SessionTimeEntity,
  ],
  //entities: [__dirname + `../db/**/*.entity.[tj]s`],
  migrations: [__dirname + `/../db/migration/**/*.[tj]s`],
  seeds: [__dirname + '/../db/seeds/**/*.[tj]s'],
  ssl: false,
  extra: {},
  keepConnectionAlive: true,
  ...overwriteConfig,
});

export const config = backofficeConfig();
export const dataSource = new DataSource(backofficeConfig());
