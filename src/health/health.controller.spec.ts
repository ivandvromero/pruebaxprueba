import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DatabaseService } from '../shared/db/connection/connection.service';

describe('Auth Service Health controller', () => {
  let healthController: HealthController;
  let databaseService: DatabaseService;
  let response: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [DatabaseService],
      imports: [TerminusModule],
    }).compile();
    databaseService = module.get<DatabaseService>(DatabaseService);
    healthController = module.get<HealthController>(HealthController);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  describe('the health check status function', () => {
    it('should return that the service is healthy', async () => {
      jest
        .spyOn(databaseService, 'isDbConnectionAlive')
        .mockResolvedValue(true);
      await healthController.check(response as Response);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
    it('should return that the service is unhealthy', async () => {
      jest
        .spyOn(databaseService, 'isDbConnectionAlive')
        .mockResolvedValue(false);
      await healthController.check(response as Response);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });
});
