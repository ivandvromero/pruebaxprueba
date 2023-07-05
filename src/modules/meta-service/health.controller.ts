import { REDIS_CONFIG } from './../../config/redis';
import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';
import { KAFKA_CLIENT_CONFIG } from '../../config/kafka';
import { Response } from 'express';
import { UserDbService } from '../../db/user/user.service';

@Controller('service/health')
export class HealthController {
  constructor(
    private readonly kafkaHealthService: KafkaHealthService,
    private readonly redisHealthService: RedisHealthService,
    private readonly userDbService: UserDbService,
  ) {}
  @Get()
  @HttpCode(200)
  async check(@Res() response: Response) {
    const UP = 'up';
    const DOWN = 'down';

    const services = [
      {
        name: 'kafka',
        check: async () =>
          await this.kafkaHealthService.checkKafkaConnection(
            KAFKA_CLIENT_CONFIG,
          ),
      },
      {
        name: 'postgres',
        check: async () => await this.userDbService.isDbConnectionAlive(),
      },
      {
        name: 'redis',
        check: async () =>
          await this.redisHealthService.checkRedisConnection({
            host: REDIS_CONFIG.host,
            port: REDIS_CONFIG.port,
            ...(process.env.REDIS_TLS_ENABLED === 'true'
              ? {
                  password: process.env.REDIS_AUTH_TOKEN,
                  tls: { servername: process.env.REDIS_HOST },
                }
              : {}),
          }),
      },
    ];

    const servicesStatusesPromises = services.map(async (service) => {
      try {
        const status = await service.check();
        return {
          name: service.name,
          status: status === true ? UP : DOWN,
          message: status,
        };
      } catch (error) {
        return {
          name: service.name,
          status: DOWN,
          message: error.message,
        };
      }
    });
    const serviceStatuses = await Promise.all(servicesStatusesPromises);
    const isAnyServiceDown = serviceStatuses.some(
      (status) => status.status === DOWN,
    );

    if (isAnyServiceDown) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: 'One or more services are down',
        services: serviceStatuses,
      });
    }
    return response.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'All services are up',
      services: serviceStatuses,
    });
  }
}
