import { UserDbService } from './user.service';
import { Module } from '@nestjs/common';
import { LoggerModule } from '@dale/logger-nestjs';
import { DatabaseService } from '../connection/connection.service';
@Module({
  imports: [LoggerModule.forRoot({ context: 'User Database Service' })],
  exports: [UserDbService],
  providers: [UserDbService, DatabaseService],
})
export class UserDbModule {}
