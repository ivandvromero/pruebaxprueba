import { of } from 'rxjs';
import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { createResponse, MockResponse } from 'node-mocks-http';
import { Response } from 'express';

import { EventLogController } from './eventlog.controller';
import { EventLogService } from './eventlog.service';
import { DynamoDBService } from '../../providers/dale/services/dynamodb.service';
import { mockEventObject, mockKafkaContext } from '../../../test/mock-data';
import {
  CustomException,
  BadRequestExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';

let response: MockResponse<Response>;
describe('EventLogController', () => {
  let controller: EventLogController;
  let spyEventLogService: EventLogService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
        {
          provide: EventLogService,
          useValue: {
            getEventLog: jest.fn(),
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
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
          }),
        },
      ],
      controllers: [EventLogController],
    }).compile();

    controller = module.get<EventLogController>(EventLogController);
    spyEventLogService = module.get<EventLogService>(EventLogService);
    response = createResponse();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(spyEventLogService).toBeDefined();
    expect(response).toBeDefined();
  });
  describe('getKafkaEvent', () => {
    it('Success', async () => {
      const expected = [];
      jest
        .spyOn(spyEventLogService, 'getEventLog')
        .mockReturnValueOnce(Promise.resolve(expected));
      const result = await controller.getKafkaEvent(
        mockKafkaContext,
        mockEventObject,
      );
      expect(result).toEqual(expected);
    });
    it('BadRequestExceptionDale', async () => {
      jest
        .spyOn(spyEventLogService, 'getEventLog')
        .mockRejectedValueOnce(new Error('test'));
      await expect(
        controller.getKafkaEvent(mockKafkaContext, mockEventObject),
      ).rejects.toThrowError(BadRequestExceptionDale);
    });
    it('CustomException', async () => {
      jest
        .spyOn(spyEventLogService, 'getEventLog')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'test'),
        );
      await expect(
        controller.getKafkaEvent(mockKafkaContext, mockEventObject),
      ).rejects.toThrowError(CustomException);
    });
  });
});
