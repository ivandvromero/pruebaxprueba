import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@dale/logger-nestjs';

import config from '../configuration/configuration';
import { DynamodbModule } from '@dale/aws-nestjs';
import { DYNAMO_TABLE } from '../shared/constants/constants';
import { join } from 'node:path';
import { DatabaseModule } from '../shared/db/db.module';
import {
  CreateRoleController,
  FindCodesByRoleController,
  FindRolesController,
} from './controllers';
import {
  CreateRoleService,
  FindCodesByRoleService,
  FindRolesByCodesService,
  FindRolesService,
  FindRoleService,
} from './services';
import { RoleRepository } from './repositories/role/role.repository';

@Module({
  imports: [
    LoggerModule.forRoot({
      context: 'Roles Module',
    }),
    ConfigModule.forRoot({
      envFilePath: join('..', '..', 'configuration', 'env.config'),
      load: [config],
      isGlobal: true,
    }),
    DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
    DatabaseModule,
  ],
  controllers: [
    CreateRoleController,
    FindCodesByRoleController,
    FindRolesController,
  ],
  providers: [
    CreateRoleService,
    FindCodesByRoleService,
    FindRolesByCodesService,
    FindRolesService,
    FindRoleService,
    RoleRepository,
  ],
  exports: [
    FindRoleService,
    FindRolesService,
    FindCodesByRoleService,
    FindRolesByCodesService,
  ],
})
export class RolesModule {}
