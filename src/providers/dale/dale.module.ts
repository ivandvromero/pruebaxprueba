import { RedisModule } from './../../db/redis/redis.module';
import { LoggerModule } from '@dale/logger-nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import serviceConfiguration from '../../config/service-configuration';
import { EnrollmentService } from './services/enrollment.service';
import { ConfigurationService } from './services/configuration.service';

@Module({
  imports: [
    HttpModule.register({ maxRedirects: 5 }),
    LoggerModule.forRoot({
      context: `${serviceConfiguration().service.name} - dale service`,
    }),
    RedisModule,
  ],
  providers: [EnrollmentService, ConfigurationService],
  exports: [EnrollmentService, ConfigurationService],
})
export class DaleModule {}
