import { Module } from '@nestjs/common';
import { LoggerModule } from '@dale/logger-nestjs';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { AdjustmentsRegisterRepository } from './adjustment-registrer.repository';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Adjustment Register Database Service' }),
  ],
  exports: [AdjustmentsRegisterRepository],
  providers: [AdjustmentsRegisterRepository, DatabaseService],
})
export class AdjustmentRegisterDBModule {}
