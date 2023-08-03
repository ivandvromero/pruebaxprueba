import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import { KAFKA_CLIENT_CONFIG } from '../../config/kafka';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';
import serviceConfiguration from '../../config/service-configuration';
import { Response } from 'express';
import { AccountDbService } from '../../db/accounts/account.service';

@Controller('service/health')
export class HealthController {
  constructor(
    private readonly accountDbService: AccountDbService,
    private readonly kafkaHealthService: KafkaHealthService,
    private readonly redisHealthService: RedisHealthService,
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
        name: 'redis',
        check: async () =>
          await this.redisHealthService.checkRedisConnection({
            host: serviceConfiguration().redis.host,
            port: serviceConfiguration().redis.port,
            ...(serviceConfiguration().redis.tls_enable === 'true'
              ? {
                  password: serviceConfiguration().redis.auth_token,
                  tls: { servername: serviceConfiguration().redis.host },
                }
              : {}),
          }),
      },
      {
        name: 'postgress',
        check: async () => await this.accountDbService.isDbConnectionAlive(),
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
