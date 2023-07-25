import { of, throwError } from 'rxjs';
import { Logger } from '@dale/logger-nestjs';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { DaleNotificationService } from './dale-notification.service';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import {
  mockSmsKeys,
  mockEventObject,
  mockSmsKeysNoName,
  mockDateInformation,
} from '../../../../test/mock-data';
import { DynamoDBService } from './dynamodb.service';

describe('DaleNotificationService', () => {
  let service: DaleNotificationService;
  let kafkaService: ClientProxy;
  let spyDynamodbService: DynamoDBService;
  const mockData = {
    id: 'f3f9354d-349a-41af-b635-e918aeb37e73',
    ext: '+57',
    phone: '3202789291',
    resend: false,
    amount: 34400,
    notificationCode: '001',
    date: '2023-04-17T17:04:35-05:00',
    keys: [{ Key: '', Value: '' }],
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DaleNotificationService,
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
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

    service = module.get<DaleNotificationService>(DaleNotificationService);
    kafkaService = module.get<ClientProxy>('KAFKA_CLIENT');
    spyDynamodbService = module.get<DynamoDBService>(DynamoDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(kafkaService).toBeDefined();
    expect(spyDynamodbService).toBeDefined();
  });

  describe('SendSmsNotification', () => {
    it('Success with new eventObject', async () => {
      const mockItem = [];
      jest
        .spyOn(spyDynamodbService, 'findSucceededMetadataByPK')
        .mockImplementation(async () => {
          return mockItem;
        });
      jest
        .spyOn(spyDynamodbService, 'insertMetadata')
        .mockImplementation(async () => {
          return true;
        });
      const res = await service.sendSmsNotification(
        mockEventObject,
        mockData.ext,
        mockData.phone,
        mockData.resend,
        mockData.notificationCode,
        mockData.keys,
      );
      expect(res).toBeDefined();
    });

    it('InternalServerExceptionDale', async () => {
      const mockItem = [];
      jest
        .spyOn(spyDynamodbService, 'findSucceededMetadataByPK')
        .mockImplementation(async () => {
          return mockItem;
        });
      jest
        .spyOn(kafkaService, 'emit')
        .mockReturnValueOnce(throwError(() => new Error('test')));
      await expect(
        service.sendSmsNotification(
          mockEventObject,
          mockData.ext,
          mockData.phone,
          mockData.resend,
          mockData.notificationCode,
          mockData.keys,
        ),
      ).rejects.toThrowError(InternalServerExceptionDale);
    });
  });
  describe('getDateInformation', () => {
    it('Success', () => {
      const date = '2023-05-09T07:44:15-05:00';
      const res = service.getDateInformation(date);
      expect(res).toBeDefined();
    });
  });
  describe('getSmsKeys', () => {
    it('Success without name', () => {
      const amount = 10000;
      const res = service.getSmsKeys(amount, mockDateInformation);
      expect(res).toEqual(mockSmsKeysNoName);
    });
    it('Success with name', () => {
      const amount = 10000;
      const name = 'Diana';
      const res = service.getSmsKeys(amount, mockDateInformation, name);
      expect(res).toEqual(mockSmsKeys);
    });
  });
});
