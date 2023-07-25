import { LoggerModule } from '@dale/logger-nestjs';
import { Module } from '@nestjs/common';
import { DatabaseService } from './connection/connection.service';

@Module({
  imports: [LoggerModule.forRoot({ context: 'Database Service' })],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
