import { LoggerModule } from '@dale/logger-nestjs';
import { Module } from '@nestjs/common';
import { DatabaseService } from '../connection/connection.service';
import { AccountDbService } from './account.service';

@Module({
  imports: [LoggerModule.forRoot({ context: 'Account Database Service' })],
  exports: [AccountDbService],
  providers: [AccountDbService, DatabaseService],
})
export class AccountsDbModule {}
