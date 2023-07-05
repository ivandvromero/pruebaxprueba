import { LoggerModule } from '@dale/logger-nestjs';
import { Module } from '@nestjs/common';
import { DatabaseService } from '../connection/connection.service';
import { DepositDbService } from './deposit.service';

@Module({
  imports: [LoggerModule.forRoot({ context: 'Deposit Database Service' })],
  exports: [DepositDbService],
  providers: [DepositDbService, DatabaseService],
})
export class DepositDbModule {}
