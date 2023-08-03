import { DaleNotificationService } from './../../providers/dale/services/dale-notification.service';
import { DaleModule } from './../../providers/dale/dale.module';
import { Module } from '@nestjs/common';
import { LoggerModule } from '@dale/logger-nestjs';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AccountsService } from './accounts.service';
import { ErrorCustomizer } from '../../utils/customize-error';
import { AccountsController } from './accounts.controller';
import { MambuModule } from '../../providers/mambu/mambu.module';
import { PtsModule } from '../../providers/pts/pts.module';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_CLIENT_CONFIG } from 'src/config/kafka';
import { AccountsDbModule } from 'src/db/accounts/accounts.module';
import { SqsLogsService } from 'src/providers/sqs-logs/sqs-logs.service';
import { AccountsEventsController } from './accounts-events.controller';
import { ContextProviderModule } from '../../providers/context-provider/context-provider.module';
import { enviroments } from '../../config/env.config';
import configuration from '../../config/service-configuration';
import * as Joi from 'joi';
import { ModuleCRM } from 'src/providers/crm/crm.module';
import { NormaStrategy } from './strategiesDeposit/strategy.const';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        PTS_API_URL: Joi.string().required(),
        PTS_USER: Joi.string().required(),
        PTS_PWD: Joi.string().required(),
        PTS_REFRESH_TOKEN: Joi.string().required(),
      }),
    }),
    LoggerModule.forRoot({ context: 'Accounts Service' }),
    MambuModule,
    PtsModule,
    AccountsDbModule,
    DaleModule,
    ModuleCRM,
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
    ContextProviderModule,
  ],
  controllers: [AccountsController, AccountsEventsController],
  providers: [
    AccountsService,
    DaleNotificationService,
    ErrorCustomizer,
    SqsLogsService,
    NormaStrategy,
  ],
})
export class AccountsModule {}
