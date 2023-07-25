import { Test, TestingModule } from '@nestjs/testing';
import {
  mockEventResponseIntra,
  mockResultEventLogArray,
} from '../test/mock-data';
import { EventSQSService } from './event-log-service';
import * as sqs from 'poc_eventos_sqs';

describe('EventLogService', () => {
  let service: EventSQSService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventSQSService],
    }).compile();

    service = module.get<EventSQSService>(EventSQSService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sendEventSQS happy path', async () => {
    const sqsService = new sqs.SqsSendEventsService(
      'https://sqs.us-east-1.amazonaws.com/261166643659/dale-dev-compute-transaction-log',
    );
    jest
      .spyOn(sqsService, 'sendMessageToSqs')
      .mockResolvedValueOnce(Promise.resolve(mockEventResponseIntra));

    jest
      .spyOn(service, 'sendEventSQS')
      .mockResolvedValueOnce(Promise.resolve(mockEventResponseIntra));
    const result = await service.sendEventSQS(mockResultEventLogArray);
    expect(result).toEqual(mockEventResponseIntra);
  });
});
