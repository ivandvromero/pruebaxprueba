import { LoggerModule } from '@dale/logger-nestjs';
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseService } from '../shared/db/connection/connection.service';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';

@Module({
  imports: [
    LoggerModule.forRoot({ context: 'Health Module Database Service' }),
    TerminusModule,
  ],
  providers: [DatabaseService, KafkaHealthService],
  controllers: [HealthController],
})
export class HealthModule {}
