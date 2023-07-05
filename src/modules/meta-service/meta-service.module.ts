import { Module } from '@nestjs/common';
import { ServiceConfigController } from './service-config.controller';
import { HealthController } from './health.controller';
import { DataTransformationModule } from '@dale/data-transformation-nestjs';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import { LoggerModule } from '@dale/logger-nestjs';
import serviceConfiguration from '../../config/service-configuration';
import { TerminusModule } from '@nestjs/terminus';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';
import { UserDbService } from 'src/db/user/user.service';
import { UserDbModule } from 'src/db/user/user.module';

@Module({
  imports: [
    UserDbModule,
    LoggerModule.forRoot({ context: 'Service Module' }),
    DataTransformationModule.forRoot({
      maskingConfig: {
        disableMask: serviceConfiguration().service.disable_mask === 'true',
      },
    }),
    TerminusModule,
  ],
  controllers: [ServiceConfigController, HealthController],
  providers: [KafkaHealthService, RedisHealthService, UserDbService],
})
export class ServiceModule {}
