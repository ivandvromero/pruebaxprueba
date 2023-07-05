import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DatabaseService } from '../../db/connection/connection.service';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';

describe('User Service Health controller', () => {
  let healthController: HealthController;
  let databaseService: DatabaseService;
  let kafkaHealthService: KafkaHealthService;
  let redisHealthService: RedisHealthService;
  let response: Partial<Response>;
  const ENV_TLS = process.env.REDIS_TLS_ENABLED;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [DatabaseService, KafkaHealthService, RedisHealthService],
      imports: [TerminusModule],
    }).compile();
    databaseService = module.get<DatabaseService>(DatabaseService);
    kafkaHealthService = module.get<KafkaHealthService>(KafkaHealthService);
    redisHealthService = module.get<RedisHealthService>(RedisHealthService);
    healthController = module.get<HealthController>(HealthController);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterAll(async () => {
    process.env.REDIS_TLS_ENABLED = ENV_TLS;
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  describe('the health check status function', () => {
    it('should return that the service is healthy', async () => {
      jest
        .spyOn(databaseService, 'isDbConnectionAlive')
        .mockResolvedValue(true);
      jest
        .spyOn(kafkaHealthService, 'checkKafkaConnection')
        .mockResolvedValue(true);
      jest
        .spyOn(redisHealthService, 'checkRedisConnection')
        .mockResolvedValue(true);
      await healthController.check(response as Response);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
    it('should return that the service is unhealthy', async () => {
      jest
        .spyOn(databaseService, 'isDbConnectionAlive')
        .mockResolvedValue(false);
      jest
        .spyOn(kafkaHealthService, 'checkKafkaConnection')
        .mockResolvedValue(false);
      jest
        .spyOn(redisHealthService, 'checkRedisConnection')
        .mockResolvedValue(false);
      await healthController.check(response as Response);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('should return that the redis service is healthy when tls enable', async () => {
      process.env.REDIS_TLS_ENABLED = 'true';
      const mockResponse: Response = {
        ...response,
      } as Response;
      jest
        .spyOn(redisHealthService, 'checkRedisConnection')
        .mockResolvedValue(true);
      jest
        .spyOn(kafkaHealthService, 'checkKafkaConnection')
        .mockResolvedValue(true);
      jest
        .spyOn(databaseService, 'isDbConnectionAlive')
        .mockResolvedValue(true);
      await healthController.check(mockResponse);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
