import { UpdateAdjustmentRegister } from '@dale/monetary-adjustment/repositories/activity-update/update-adjustment-register.entity';
import { FileMassiveMonetaryAdjustment } from '@dale/monetary-adjustment/repositories/file-monetary-adjustment/massive-monetary-adjustment-file.entity';
import { MonetaryAdjustmentEntityOrm } from '@dale/monetary-adjustment/repositories/monetary-adjustment/monetary-adjustment.entity';
import { NotificationEntity } from '@dale/notifications/repositories';
import { RoleEntity } from '@dale/roles/repositories';
import { SessionTimeEntity } from '@dale/session-time/repositories';
import { TransactionCodesEntity } from '@dale/transaction-codes/index';
import { HistoricalEntity } from '../../peps/repository/historical.entity';
import { backofficeConfig } from './typeorm.config';
import { DataSource } from 'typeorm';

describe('Configuration Tests', () => {
  let dataSource: DataSource;

  beforeAll(() => {
    dataSource = new DataSource(backofficeConfig());
  });

  it('should have the correct database connection options', () => {
    const config = backofficeConfig();

    expect(config.type).toEqual('postgres');
    expect(config.name).toEqual('backoffice');
    expect(config.host).toEqual(process.env.TYPEORM_HOST);
    expect(config.port).toEqual(parseInt(process.env.TYPEORM_PORT, 10));
    expect(config.username).toEqual(process.env.TYPEORM_BACKOFFICE_USERNAME);
    expect(config.password).toEqual(process.env.TYPEORM_USER_PASSWORD);
    expect(config.database).toEqual(process.env.TYPEORM_BACKOFFICE_DATABASE);
    expect(config.synchronize).toBeFalsy();
    expect(config.logging).toEqual(
      process.env.NODE_ENV === 'development' ? true : false,
    );
    expect(config.entities).toEqual([
      MonetaryAdjustmentEntityOrm,
      FileMassiveMonetaryAdjustment,
      RoleEntity,
      TransactionCodesEntity,
      UpdateAdjustmentRegister,
      HistoricalEntity,
      NotificationEntity,
      SessionTimeEntity,
    ]);
    expect(config.migrations).toEqual([
      `${__dirname}/../db/migration/**/*.[tj]s`,
    ]);
    expect(config.seeds).toEqual([`${__dirname}/../db/seeds/**/*.[tj]s`]);
    expect(config.ssl).toBeFalsy();
    expect(config.extra).toEqual({});
    expect(config.keepConnectionAlive).toBeTruthy();
  });

  it('should create a data source instance with the correct configuration', () => {
    expect(dataSource.options).toEqual(backofficeConfig());
  });
});
