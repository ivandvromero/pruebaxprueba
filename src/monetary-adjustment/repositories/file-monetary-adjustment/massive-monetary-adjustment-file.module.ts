import { Module } from '@nestjs/common';
import { LoggerModule } from '@dale/logger-nestjs';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { MassiveMonetaryAdjustmentFileRepository } from './massive-monetary-adjustment-file.repository';
import { FindNextUserMassiveMonetaryAdjustmentService } from '@dale/monetary-adjustment/modules/monetary-adjustment/service/find-next-user-massive-monetary-adjustment.service';
import { UserWorkBalancerModule } from '@dale/user-work-balancer/user-work-balancer.module';
import { Auth0ManagementModule } from 'src/shared/providers/auth0-management-api/auth0-management.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import config from '../../../configuration/configuration';
import { NotificationsModule } from '@dale/notifications/notifications.module';
import { RolesModule } from '@dale/roles/roles.module';
import { TransactionCodesModule } from '@dale/transaction-codes/transaction-codes.module';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Monetary Adjustment Database Service' }),
    ConfigModule.forRoot({
      envFilePath: join('..', '..', 'configuration', 'env.config'),
      load: [config],
      isGlobal: true,
    }),
    UserWorkBalancerModule,
    NotificationsModule,
    Auth0ManagementModule,
    RolesModule,
    TransactionCodesModule,
  ],
  exports: [
    MassiveMonetaryAdjustmentFileRepository,
    FindNextUserMassiveMonetaryAdjustmentService,
  ],
  providers: [
    MassiveMonetaryAdjustmentFileRepository,
    DatabaseService,
    FindNextUserMassiveMonetaryAdjustmentService,
  ],
})
export class MassiveMonetaryAdjustmentFileDBModule {}
