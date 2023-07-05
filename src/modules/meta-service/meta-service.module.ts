import { Module } from '@nestjs/common';
import { ServiceConfigController } from './service-config.controller';
import { HealthController } from './health.controller';
import { DataTransformationModule } from '@dale/data-transformation-nestjs';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import { LoggerModule } from '@dale/logger-nestjs';
import serviceConfiguration from '../../config/service-configuration';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseService } from '../../db/connection/connection.service';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Service Module' }),
    DataTransformationModule.forRoot({
      maskingConfig: {
        disableMask: serviceConfiguration().service.disable_mask === 'true',
      },
    }),
    TerminusModule,
  ],
  controllers: [ServiceConfigController, HealthController],
  providers: [KafkaHealthService, DatabaseService, RedisHealthService],
})
export class ServiceModule {}
