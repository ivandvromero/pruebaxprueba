import { Test, TestingModule } from '@nestjs/testing';
import { HeaderDTO } from '../dto/header.dto';
import { EventLogService } from './event-log-service';
import { SqsSendEventsService } from 'poc_eventos_sqs';
import {
  mockEventResponseFavorite,
  mockFavorite,
  mockResultFavorite,
} from '../../../test/mock-data';

describe('sendDebitTransferSQS', () => {
  let spyEventLogService: EventLogService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        EventLogService,
        {
          provide: SqsSendEventsService,
          useFactory: () => ({
            sendMessageToSqs: jest.fn(),
          }),
        },
      ],
    }).compile();
    spyEventLogService = module.get<EventLogService>(EventLogService);
  });

  const headers: HeaderDTO = {
    Timestamp: '2021-0-11T01:23:45.678Z',
    IpAddress: '127.0.0.1',
    TransactionId: '8a68b583-8d5f-44e0-b4bb-b81c375d3ba9',
    SessionId: '8a68b583-8d5f-44e0-b4bb-b81c375d3ba9',
    ChannelId: '',
    Application: '',
    UserAgent: '',
    ClientId: '',
    ClientIdType: '',
    OriginCellphone: '',
  };

  describe('sendDebitTransferSQS', () => {
    it('sendDebitTransferSQS', async () => {
      jest
        .spyOn(spyEventLogService.sqsService, 'sendMessageToSqs')
        .mockResolvedValue(mockEventResponseFavorite);
      const result = await spyEventLogService.sendDebitTransferSQS(
        mockFavorite,
        headers,
        mockResultFavorite,
      );
      expect(result).toEqual(mockEventResponseFavorite);
    });
  });
});
