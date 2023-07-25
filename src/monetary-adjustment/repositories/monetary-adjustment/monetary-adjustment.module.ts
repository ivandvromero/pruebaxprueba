import { Module } from '@nestjs/common';
import { LoggerModule } from '@dale/logger-nestjs';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { MonetaryAdjustmentRepository } from './monetary-adjustment.repository';
import { NotificationsModule } from '@dale/notifications/notifications.module';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Monetary Adjustment Database Service' }),
    NotificationsModule,
  ],
  providers: [MonetaryAdjustmentRepository, DatabaseService],
  exports: [MonetaryAdjustmentRepository],
})
export class MonetaryAdjustmentDBModule {}
