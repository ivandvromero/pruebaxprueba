import { LoggerModule } from '@dale/logger-nestjs';
import { Module } from '@nestjs/common';
import { DatabaseService } from '../connection/connection.service';
import { DepositDbService } from './deposit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './deposit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deposit]),
    LoggerModule.forRoot({ context: 'Deposit Database Service' }),
  ],
  exports: [DepositDbService],
  providers: [DepositDbService, DatabaseService],
})
export class DepositDbModule {}
