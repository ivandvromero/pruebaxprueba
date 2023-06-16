//Libraries
import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';

//Services
import { EventLogService } from './eventlog.service';

//Mocks
import { mockEventObject } from '../../../test/mock-data';

//Providers
import { DynamoDBService } from '../../providers/dale/services/dynamodb.service';
import { ProviderEventlogContext } from '../../providers/context-eventlog/eventlog-context';
import { EventSQSService } from '../../providers/context-eventlog/event-log/event-log-service';

describe('EventLogService', () => {
  let service: EventLogService;
  let eventSQSService: EventSQSService;
  let spyDynamodbService: DynamoDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventLogService,
        {
          provide: EventSQSService,
          useValue: {
            sendEventSQS: jest.fn(),
          },
        },
        {
          provide: ProviderEventlogContext,
          useValue: {
            setStrategy: jest.fn(),
            generateEventLog: jest.fn(),
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
        {
          provide: DynamoDBService,
          useValue: {
            insertMetadata: jest.fn(),
            findSucceededMetadataByPK: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventLogService>(EventLogService);
    eventSQSService = module.get<EventSQSService>(EventSQSService);
    spyDynamodbService = module.get<DynamoDBService>(DynamoDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(eventSQSService).toBeDefined();
    expect(spyDynamodbService).toBeDefined();
  });
  describe('getEventLog', () => {
    it('Success with new eventObject', async () => {
      const expected = 'event log';
      const mockItem = [];
      jest
        .spyOn(spyDynamodbService, 'insertMetadata')
        .mockImplementation(async () => {
          return true;
        });
      const spyOnGenerateEventLog = jest
        .spyOn(eventSQSService, 'sendEventSQS')
        .mockReturnValueOnce(Promise.resolve('event log'));
      jest
        .spyOn(spyDynamodbService, 'findSucceededMetadataByPK')
        .mockImplementation(async () => {
          return mockItem;
        });
      const result = await service.getEventLog(mockEventObject);
      expect(spyOnGenerateEventLog).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
    it('Success with succeeded metadata', async () => {
      const mockItem = [{ SK: 'EVENT_LOG', Status: false }];
      const spyOnFindSucceededMetadataByPK = jest
        .spyOn(spyDynamodbService, 'findSucceededMetadataByPK')
        .mockImplementation(async () => {
          return mockItem;
        });
      await service.getEventLog(mockEventObject);
      expect(spyOnFindSucceededMetadataByPK).toHaveBeenCalled();
    });
  });
});
