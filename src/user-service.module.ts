import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ServiceModule } from './modules/meta-service/meta-service.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@dale/logger-nestjs';
import configuration from './config/service-configuration';
import { UserFavoritesModule } from './modules/user-favorite/user-favorite.module';
import * as Joi from 'joi';
import { enviroments } from './config/env/env.config';
import { RedisModule } from './db/redis/redis.module';
import {
  ALL_EXCEPTION_FILTERS_FOR_PROVIDER,
  ManageErrorsModule,
} from '@dale/manage-errors-nestjs';
import { ErrorCodeMessages } from './shared/code-erros/error-codes.local';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './db/deposit/deposit.entity';
import { Favorite } from './db/favorite/favorite.entity';
import { User } from './db/user/user.entity';

@Module({
  imports: [
    UserModule,
    UserFavoritesModule,
    ServiceModule,
    RedisModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        port: parseInt(process.env.TYPEORM_PORT, 10),
        username: process.env.TYPEORM_USER_USERNAME,
        password: process.env.TYPEORM_USER_PASSWORD,
        database: process.env.TYPEORM_USER_DATABASE,
        entities: [Deposit, Favorite, User],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: enviroments[configuration().service.node_env] || '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        // service
        NODE_ENV: Joi.string().required(),
        SERVICE_TYPE: Joi.string().required(),
        SERVICE_NAME: Joi.string().required(),
        USER_SERVICE_PORT: Joi.string().required(),
        CLOUD_SERVICE_PROVIDER: Joi.string().required(),
        ENABLE_AUDIT: Joi.string().required(),
        // aws
        AWS_REGION: Joi.string().required(),
        AWS_XRAY_DAEMON_ADDRESS: Joi.string().required(),
        CERTIFICATE_PRIVATE_KEY: Joi.string().required(),
        PUBLIC_CERTIFICATE: Joi.string().required(),
        // bd
        TYPEORM_HOST: Joi.string().required(),
        TYPEORM_PORT: Joi.string().required(),
        TYPEORM_USER_USERNAME: Joi.string().required(),
        TYPEORM_USER_PASSWORD: Joi.string().required(),
        TYPEORM_USER_DATABASE: Joi.string().required(),
        DB_ROTATING_KEY: Joi.string().required(),
        DB_CONNECTION_REFRESH_MINUTES: Joi.string().required(),
        DB_SSL_ENABLED: Joi.string().required(),
        // kafka
        KAFKA_URLS: Joi.string().required(),
        KAFKA_SSL_ENABLED: Joi.string().required(),
        KAFKA_RETRY_POLICY: Joi.string().required(),
      }),
    }),
    LoggerModule.forRoot({ context: 'User Service' }),
    ManageErrorsModule.forRoot({
      errorCodesLocal: ErrorCodeMessages,
      nameService: 'USER_SERVICE',
    }),
  ],
  providers: [...ALL_EXCEPTION_FILTERS_FOR_PROVIDER],
})
export class UserServiceModule {}
