import { AccountsDbModule } from 'src/db/accounts/accounts.module';
import { Module } from '@nestjs/common';
import { ServiceConfigController } from './service-config.controller';
import { HealthController } from '../meta-service/health.controller';
import { DataTransformationModule } from '@dale/data-transformation-nestjs';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';
import { TerminusModule } from '@nestjs/terminus';
@Module({
  imports: [
    AccountsDbModule,
    DataTransformationModule.forRoot({
      maskingConfig: { disableMask: process.env.DISABLE_MASK === 'true' },
    }),
    TerminusModule,
  ],
  controllers: [ServiceConfigController, HealthController],
  providers: [KafkaHealthService, RedisHealthService],
})
export class ServiceModule {}
