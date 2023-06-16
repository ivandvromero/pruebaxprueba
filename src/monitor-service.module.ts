import { Module } from '@nestjs/common';
import { MonitorModule } from './modules/monitor/monitor.module';
import { ServiceModule } from './modules/meta-service/meta-service.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@dale/logger-nestjs';
import configuration from './config/service-configuration';
import * as Joi from 'joi';
import { enviroments } from './config/env/env.config';
import { EnrollmentNaturalPersonModule } from './providers/enrollment-natural-person/enrollment-np.module';
import { CrmModule } from './providers/crm/crm.module';
import { UserModule } from './providers/user/user.module';
import {
  ManageErrorsModule,
  ALL_EXCEPTION_FILTERS_FOR_PROVIDER,
} from '@dale/manage-errors-nestjs';
import { errorCodesLocal } from './shared/manage-errors/code-erros/error-codes.local';
import { EventLogModule } from './modules/eventlog/eventlog.module';

@Module({
  imports: [
    MonitorModule,
    EventLogModule,
    ServiceModule,
    CrmModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[configuration().service.node_env] || '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        // service
        NODE_ENV: Joi.string().required(),
        SERVICE_TYPE: Joi.string().required(),
        SERVICE_NAME: Joi.string().required(),
        MONITOR_SERVICE_PORT: Joi.string().required(),
        CLOUD_SERVICE_PROVIDER: Joi.string().required(),
        ENABLE_AUDIT: Joi.string().required(),
        // aws
        AWS_REGION: Joi.string().required(),
        AWS_XRAY_DAEMON_ADDRESS: Joi.string().required(),
        CERTIFICATE_PRIVATE_KEY: Joi.string().required(),
        PUBLIC_CERTIFICATE: Joi.string().required(),
        // kafka
        KAFKA_URLS_PTS: Joi.string().required(),
        KAFKA_SSL_ENABLED_PTS: Joi.string().required(),
        SASL_USERNAME_PTS: Joi.string().required(),
        SASL_PASSWORD_PTS: Joi.string().required(),
        KAFKA_RETRIES: Joi.string().required(),
        KAFKA_RETRY_POLICY_PTS: Joi.string().required(),
        KAFKA_URLS: Joi.string().required(),
        KAFKA_SSL_ENABLED: Joi.string().required(),
        SASL_USERNAME: Joi.string().required(),
        SASL_PASSWORD: Joi.string().required(),
        KAFKA_RETRY_POLICY: Joi.string().required(),
        KAFKA_TOPIC_PTS: Joi.string().required(),
        // services
        USER_SERVICE_URL: Joi.string().required(),
        ENROLLMENT_NP_SERVICE_URL: Joi.string().required(),
        // redis
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        REDIS_TLS_ENABLED: Joi.string().required(),
        REDIS_AUTH_TOKEN: Joi.string().required(),
        REDIS_TTL: Joi.string().required(),
        // crm
        CRM_SERVICE_URL: Joi.string().required(),
        CRM_USERNAME: Joi.string().required(),
        CRM_PASSWORD: Joi.string().required(),
        // sqs
        SQS_URL: Joi.string().required(),
        SQS_TRANSACTION_LOG: Joi.string().required(),
        // event log
        EVENT_LOG_VERSION: Joi.string().required(),
        EVENT_LOG_MNEMONIC: Joi.string().required(),
        EVENT_LOG_DEBITCODE: Joi.string().required(),
        EVENT_LOG_CREDITCODE: Joi.string().required(),
        EVENT_LOG_DEBITNAME: Joi.string().required(),
        EVENT_LOG_CREDITNAME: Joi.string().required(),
        EVENT_LOG_APPLICATION: Joi.string().required(),
        EVENT_LOG_CHANNEL: Joi.string().required(),
        // card
        CARD_SERVICE_URL: Joi.string().required(),
      }),
    }),
    LoggerModule.forRoot({ context: 'Monitor Service' }),
    EnrollmentNaturalPersonModule,
    UserModule,
    ManageErrorsModule.forRoot({
      errorCodesLocal: errorCodesLocal,
      nameService: 'Monitor Service',
    }),
  ],
  providers: [...ALL_EXCEPTION_FILTERS_FOR_PROVIDER],
})
export class MonitorServiceModule {}
