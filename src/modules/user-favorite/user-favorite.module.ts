import { Module } from '@nestjs/common';
import { UserFavoritesService } from './user-favorite.service';
import { UserFavoriteController } from './user-favorite.controller';
import { FavoriteDbModule } from '../../db/favorite/favorite.module';
import { LoggerModule } from '@dale/logger-nestjs';

@Module({
  imports: [
    FavoriteDbModule,
    LoggerModule.forRoot({ context: 'Favorite Module' }),
  ],
  providers: [UserFavoritesService],
  controllers: [UserFavoriteController],
})
export class UserFavoritesModule {}
