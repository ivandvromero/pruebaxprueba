import '../../config/env/env.config';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { KafkaHealthService } from '@dale/shared-nestjs/services/kafka/kafka-health.service';
import {
  mockCheckResultFailure,
  mockCheckResultSuccess,
} from '../../../test/mock-data';
import { RedisHealthService } from '@dale/shared-nestjs/services/redis/redis-health-service';

describe('Screening Service Health controller', () => {
  let testingModule: TestingModule;
  let healthController: HealthController;
  let spyKafkaHealthService;
  let spyRedisHealthService;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    healthController = testingModule.get(HealthController);
    spyKafkaHealthService = testingModule.get(KafkaHealthService);
    spyRedisHealthService = testingModule.get(RedisHealthService);
  });

  describe('the health check status function', () => {
    it('should return that the service is healthy', async () => {
      spyKafkaHealthService.checkKafkaConnection.mockImplementation(() =>
        Promise.resolve(true),
      );
      spyRedisHealthService.checkRedisConnection.mockImplementation(() =>
        Promise.resolve(true),
      );
      const res = await healthController.check();
      expect(res).toEqual(mockCheckResultSuccess);
    });
    it('should return that the service is not healthy', async () => {
      spyKafkaHealthService.checkKafkaConnection.mockImplementation(() =>
        Promise.resolve(false),
      );
      spyRedisHealthService.checkRedisConnection.mockImplementation(() =>
        Promise.resolve('Connection is closed.'),
      );
      const res = await healthController.check();
      expect(res).toEqual(mockCheckResultFailure);
    });
  });
});
