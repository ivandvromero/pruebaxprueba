import { LoggerModule } from '@dale/logger-nestjs';
import { Module } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { DatabaseService } from '../../../shared/db/connection/connection.service';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Notifications Repository Module' }),
  ],
  providers: [NotificationsRepository, DatabaseService],
  exports: [NotificationsRepository],
})
export class NotificationsRepositoryModule {}
