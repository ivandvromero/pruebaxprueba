import { Module } from '@nestjs/common';
import { ServiceConfigController } from './service-config.controller';
import { HealthController } from './health.controller';
import { DataTransformationModule } from '@dale/data-transformation-nestjs';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import { LoggerModule } from '@dale/logger-nestjs';
import serviceConfiguration from '../../config/service-configuration';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';
import { TerminusModule } from '@nestjs/terminus';

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
  providers: [KafkaHealthService, RedisHealthService],
})
export class ServiceModule {}
