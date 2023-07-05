import { FavoriteDbService } from './favorite.service';
import { Module } from '@nestjs/common';
import { LoggerModule } from '@dale/logger-nestjs';
import { DatabaseService } from '../connection/connection.service';
import { EventLogService } from '../../shared/event-log/event-log-service';
import { Favorite } from './favorite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    LoggerModule.forRoot({ context: 'UserFavorite Database Service' }),
  ],
  providers: [FavoriteDbService, DatabaseService, EventLogService],
  exports: [FavoriteDbService],
})
export class FavoriteDbModule {}
