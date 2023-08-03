import serviceConfiguration from '../../config/service-configuration';
import { AccountDbService } from './../../db/accounts/account.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';
import { TerminusModule } from '@nestjs/terminus';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('Auth Service Health controller', () => {
  let healthController: HealthController;
  let spyKafkaHealthService;
  let spyRedisHealthService;
  let spyAccountgDbService;
  let response: Partial<Response>;
  const ENV_TLS = process.env.REDIS_TLS_ENABLED;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: KafkaHealthService,
          useFactory: () => ({
            checkKafkaConnection: jest.fn(),
          }),
        },
        {
          provide: RedisHealthService,
          useFactory: () => ({
            checkRedisConnection: jest.fn(),
          }),
        },
        {
          provide: AccountDbService,
          useFactory: () => ({
            isConnected: jest.fn(),
            isDbConnectionAlive: jest.fn(),
          }),
        },
      ],
      imports: [TerminusModule],
    }).compile();
    spyAccountgDbService = module.get(AccountDbService);
    spyKafkaHealthService = module.get(KafkaHealthService);
    spyRedisHealthService = module.get(RedisHealthService);
    healthController = module.get<HealthController>(HealthController);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterAll(async () => {
    serviceConfiguration().redis.tls_enable = ENV_TLS;
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  describe('the health check status function', () => {
    it('should return that the service is healthy', async () => {
      jest
        .spyOn(spyRedisHealthService, 'checkRedisConnection')
        .mockResolvedValue(true);
      jest
        .spyOn(spyKafkaHealthService, 'checkKafkaConnection')
        .mockResolvedValue(true);
      jest
        .spyOn(spyAccountgDbService, 'isDbConnectionAlive')
        .mockResolvedValue(true);
      await healthController.check(response as Response);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
    it('should return that the service is unhealthy', async () => {
      jest
        .spyOn(spyRedisHealthService, 'checkRedisConnection')
        .mockResolvedValue(false);
      jest
        .spyOn(spyKafkaHealthService, 'checkKafkaConnection')
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
        .spyOn(spyRedisHealthService, 'checkRedisConnection')
        .mockResolvedValue(true);
      jest
        .spyOn(spyKafkaHealthService, 'checkKafkaConnection')
        .mockResolvedValue(true);
      jest
        .spyOn(spyAccountgDbService, 'isDbConnectionAlive')
        .mockResolvedValue(true);
      await healthController.check(mockResponse);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
