import { of } from 'rxjs';
import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { createResponse, MockResponse } from 'node-mocks-http';
import { Response } from 'express';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { DynamoDBService } from '../../providers/dale/services/dynamodb.service';
import { mockEventObject, mockKafkaContext } from '../../../test/mock-data';
import {
  CustomException,
  BadRequestExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';

let response: MockResponse<Response>;
describe('MonitorController', () => {
  let controller: MonitorController;
  let service: MonitorService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
          }),
        },
        {
          provide: MonitorService,
          useValue: {
            validateMessageEvent: jest
              .fn()
              .mockReturnValue(Promise.resolve({})),
            getTrama: jest.fn(),
          },
        },
        {
          provide: DynamoDBService,
          useValue: {
            insertMetadata: jest.fn(),
            findSucceededMetadataByPK: jest.fn(),
          },
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
      ],
      controllers: [MonitorController],
    }).compile();

    controller = module.get<MonitorController>(MonitorController);
    service = module.get<MonitorService>(MonitorService);
    response = createResponse();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(response).toBeDefined();
  });
  describe('getKafkaEvent', () => {
    const expected = 'trama';
    it('Success', async () => {
      jest
        .spyOn(service, 'getTrama')
        .mockReturnValueOnce(Promise.resolve(expected));
      const result = await controller.getKafkaEvent(
        mockKafkaContext,
        mockEventObject,
      );
      expect(result).toEqual(expected);
    });
    it('BadRequestExceptionDale', async () => {
      jest.spyOn(service, 'getTrama').mockRejectedValueOnce(new Error('test'));
      await expect(
        controller.getKafkaEvent(mockKafkaContext, mockEventObject),
      ).rejects.toThrowError(BadRequestExceptionDale);
    });
    it('CustomException', async () => {
      jest
        .spyOn(service, 'getTrama')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'test'),
        );
      await expect(
        controller.getKafkaEvent(mockKafkaContext, mockEventObject),
      ).rejects.toThrowError(CustomException);
    });
  });
});
