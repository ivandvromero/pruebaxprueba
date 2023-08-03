import { RedisModule } from './../../db/redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DaleNotificationService } from './services/dale-notification.service';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_CLIENT_CONFIG } from '@dale/shared-nestjs/utils/audit/constants/kafka';
import { EnrollmentService } from './services/enrollment.service';
import { ConfigurationService } from './services/configuration.service';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
    RedisModule,
  ],
  exports: [DaleNotificationService, EnrollmentService, ConfigurationService],
  providers: [DaleNotificationService, EnrollmentService, ConfigurationService],
})
export class DaleModule {}
