import { Controller, Get, HttpCode, Injectable } from '@nestjs/common';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import {
  KAFKA_CLIENT_CONFIG,
  KAFKA_CLIENT_PTS_CONFIG,
} from '../../config/kafka';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';
import { REDIS_CONFIG } from '../../config/redis';

@Injectable()
@Controller('service/health')
export class HealthController {
  constructor(
    private readonly kafkaHealthService: KafkaHealthService,
    private readonly redisHealthService: RedisHealthService,
  ) {}

  @Get()
  @HttpCode(200)
  async check() {
    const kafkaPtsConnection =
      await this.kafkaHealthService.checkKafkaConnection(
        KAFKA_CLIENT_PTS_CONFIG,
      );
    const kafkaConnection = await this.kafkaHealthService.checkKafkaConnection(
      KAFKA_CLIENT_CONFIG,
    );
    const redisConnection = await this.redisHealthService.checkRedisConnection(
      REDIS_CONFIG,
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
    if (kafkaPtsConnection === true) {
      result['kafkaPts'] = {
        kafkaPtsConnection,
        message: 'Kafka PTS ok',
      };
    } else {
      result['kafkaPts'] = {
        kafkaPtsConnection,
      };
    }
    if (redisConnection === true) {
      result['redis'] = {
        redisConnection,
        message: 'Redis ok',
      };
    } else {
      result['redis'] = {
        redisConnection,
      };
    }
    return result;
  }
}
