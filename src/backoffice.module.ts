import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { MonetaryAdjustmentModule } from './monetary-adjustment/monetary-adjustment.module';

import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './shared/providers/auth0/modules/auth.module';
import { SecretsManagerService } from '@dale/aws-nestjs';
import { UserWorkBalancerModule } from '@dale/user-work-balancer/user-work-balancer.module';
import { PepsModule } from './peps/peps.module';
import { SessionTimeModule } from './session-time/session-time.module';
import { RolesModule } from './roles';
import { TransactionCodesModule } from './transaction-codes/transaction-codes.module';

@Module({
  imports: [
    AuthModule,
    MonetaryAdjustmentModule,
    ClientModule,
    HealthModule,
    NotificationsModule,
    UserWorkBalancerModule,
    PepsModule,
    SessionTimeModule,
    RolesModule,
    TransactionCodesModule,
  ],
  controllers: [],
  providers: [SecretsManagerService],
})
export class BackOfficeModule {}
