import { LoggerModule } from '@dale/logger-nestjs';
import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { enviroments } from '../../config/env.config';
import configuration from '../../config/service-configuration';
import { ServiceCRM } from './crm.service';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_CLIENT_CONFIG } from 'src/config/kafka';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        CRM_API_URL: Joi.string().required(),
      }),
    }),
    LoggerModule.forRoot({ context: 'CRM Service' }),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
  ],
  providers: [ServiceCRM],
  exports: [ServiceCRM],
})
export class ModuleCRM {}
