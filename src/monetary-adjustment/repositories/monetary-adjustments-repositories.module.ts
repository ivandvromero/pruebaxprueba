import { LoggerModule } from '@dale/logger-nestjs';
import { Module } from '@nestjs/common';
import { MassiveMonetaryAdjustmentFileDBModule } from './file-monetary-adjustment/massive-monetary-adjustment-file.module';
import { MonetaryAdjustmentDBModule } from './monetary-adjustment/monetary-adjustment.module';
import { AdjustmentRegisterDBModule } from './activity-update/adjustment-registrer.module';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Monetary Adjustment Database Module' }),
    MonetaryAdjustmentDBModule,
    MassiveMonetaryAdjustmentFileDBModule,
    AdjustmentRegisterDBModule,
  ],
  exports: [
    MonetaryAdjustmentDBModule,
    MassiveMonetaryAdjustmentFileDBModule,
    AdjustmentRegisterDBModule,
  ],
})
export class MonetaryAdjustmentsRepositoriesModule {}
