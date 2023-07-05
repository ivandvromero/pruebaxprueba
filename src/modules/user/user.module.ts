import { UserDbModule } from '../../db/user/user.module';
import { Module } from '@nestjs/common';
import { UserServiceController } from './user.controller';
import { UserService } from './user.service';
import { LoggerModule } from '@dale/logger-nestjs';
import { KAFKA_CLIENT_CONFIG } from '../../config/kafka';
import { ClientsModule } from '@nestjs/microservices';
import { DepositDbModule } from '../../db/deposit/deposit.module';
import { DaleModule } from '../../providers/dale/dale.module';
import { SqsLogsService } from '../../providers/sqs-logs/sqs-logs.service';
import { UserEventsController } from './user-events.controller';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'User Module' }),
    UserDbModule,
    DepositDbModule,
    DaleModule,
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
  ],
  controllers: [UserServiceController, UserEventsController],
  providers: [UserService, SqsLogsService],
})
export class UserModule {}
