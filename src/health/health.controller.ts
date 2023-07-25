import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { DatabaseService } from '../shared/db/connection/connection.service';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import { KAFKA_CLIENT_CONFIG } from '../configuration/kafka';

@Controller('/health')
export class HealthController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly kafkaHealthService: KafkaHealthService,
  ) {}
  @Get()
  @HttpCode(200)
  async check(@Res() response: Response) {
    const kafkaConnection = await this.kafkaHealthService.checkKafkaConnection(
      KAFKA_CLIENT_CONFIG,
    );
    const result = {};
    if (kafkaConnection === true) {
      result['kafka'] = {
        kafkaConnection,
        message: 'Kafka ok',
      };
    } else {
      result['kafka'] = {
        kafkaConnection,
      };
    }
    const UP = 'up';
    const DOWN = 'down';

    const services = [
      {
        name: 'postgres',
        check: async () => await this.databaseService.isDbConnectionAlive(),
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
