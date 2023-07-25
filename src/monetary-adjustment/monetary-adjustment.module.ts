import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@dale/logger-nestjs';

import config from '../configuration/configuration';
import { DynamodbModule } from '@dale/aws-nestjs';
import { DYNAMO_TABLE } from '../shared/constants/constants';
import { join } from 'node:path';
import { ClientModule } from '@dale/client/client.module';
import { TransactionDispatch } from './modules/monetary-adjustment/chain-handlers/handlers/transaction-dispatch';
import { MonetaryAdjustmentController } from './modules/monetary-adjustment/controller/monetary-adjustment.controller';
import { MonetaryAdjustmentService } from './modules/monetary-adjustment/service/monetary-adjustment.service';
import { TransactionLevel } from './modules/monetary-adjustment/chain-handlers/handlers/transaction-level';
import { MassiveTransactionLevel } from './modules/monetary-adjustment/chain-handlers/massive handlers/massive-transaction-level';
import { MassiveTransactionDispatch } from './modules/monetary-adjustment/chain-handlers/massive handlers/massive-transaction-dispatch';
import { TransactionCodeController } from '../transaction-codes/controllers/transaction-codes.controller';
import { MonetaryAdjustmentsRepositoriesModule } from './repositories/monetary-adjustments-repositories.module';
import { DatabaseModule } from '../shared/db/db.module';
import { UserWorkBalancerModule } from '@dale/user-work-balancer/user-work-balancer.module';
import { FindNextUserSingleMonetaryAdjustmentService } from './modules/monetary-adjustment/service/find-next-user-single-monetary-adjustment.service';
import { FindNextUserMassiveMonetaryAdjustmentService } from './modules/monetary-adjustment/service/find-next-user-massive-monetary-adjustment.service';
import { NotificationsModule } from '@dale/notifications/notifications.module';
import { PtsConnectorModule } from '@dale/pts-connector/pts-conector.module';
import { RolesModule } from '../roles';
import { TransactionCodesModule } from '@dale/transaction-codes/transaction-codes.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      context: 'Monetary Adjustment Module',
    }),
    ConfigModule.forRoot({
      envFilePath: join('..', '..', 'configuration', 'env.config'),
      load: [config],
      isGlobal: true,
    }),
    MonetaryAdjustmentsRepositoriesModule,
    ClientModule,
    DatabaseModule,
    UserWorkBalancerModule,
    NotificationsModule,
    DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
    PtsConnectorModule,
    RolesModule,
    TransactionCodesModule,
  ],
  providers: [
    MonetaryAdjustmentService,
    TransactionLevel,
    TransactionDispatch,
    MassiveTransactionLevel,
    MassiveTransactionDispatch,
    FindNextUserSingleMonetaryAdjustmentService,
    FindNextUserMassiveMonetaryAdjustmentService,
  ],
  controllers: [MonetaryAdjustmentController, TransactionCodeController],
})
export class MonetaryAdjustmentModule {}
