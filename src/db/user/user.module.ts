import { UserDbService } from './user.service';
import { Module } from '@nestjs/common';
import { LoggerModule } from '@dale/logger-nestjs';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LoggerModule.forRoot({ context: 'User Database Service' }),
  ],
  exports: [UserDbService],
  providers: [UserDbService],
})
export class UserDbModule {}
