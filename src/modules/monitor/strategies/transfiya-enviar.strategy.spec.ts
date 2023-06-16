//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  mockEventObject,
  mockBaseTransform,
  mockGetClientDestination,
  mockDateInformation,
  mockSmsKeysNoName,
  mockSmsKeys,
} from '../../../../test/mock-data';

//Strategies
import { TransfiyaEnviarStrategy } from './transfiya-enviar.strategy';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { of } from 'rxjs';
import { Logger } from '@dale/logger-nestjs';
import { DynamoDBService } from '../../../providers/dale/services/dynamodb.service';
import { DateInfo } from '../../../providers/dale/dto/dale-notification.dto';

describe('Transifya Enviar Strategy', () => {
  let transfiyaEnviarStrategy: TransfiyaEnviarStrategy;
  let daleNotificationService: DaleNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfiyaEnviarStrategy,
        {
          provide: DaleNotificationService,
          useValue: {
            sendSmsNotification: jest.fn(),
            getDateInformation: jest.fn(),
            getSmsKeys: jest.fn(),
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
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
      ],
    }).compile();
    transfiyaEnviarStrategy = module.get<TransfiyaEnviarStrategy>(
      TransfiyaEnviarStrategy,
    );
    daleNotificationService = module.get<DaleNotificationService>(
      DaleNotificationService,
    );
  });

  it('should be defined', () => {
    expect(transfiyaEnviarStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      jest
        .spyOn(transfiyaEnviarStrategy, 'sendSmsNotification')
        .mockImplementation(() => Promise.resolve());
      const result = await transfiyaEnviarStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });
  describe('getProductDestination', () => {
    it('Success', async () => {
      const result = await transfiyaEnviarStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual({ productDestination: {} });
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = {
        clientDestination: { Field_K7_0036: 'beneficiaryAccount' },
      };
      const event = { ...mockEventObject };
      event.CFO.additionals.beneficiaryDetails.beneficiaryAccount =
        'beneficiaryAccount';
      const result = await transfiyaEnviarStrategy.getClientDestination(
        id,
        mockEventObject,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getOrderer', () => {
    it('Success', async () => {
      const expected = {
        cellPhone: '318-677-9266',
        externalId: '52',
        lastName: 'Doe',
        name: 'Jhoon',
        phone: '318-677-9266',
        secondName: '',
      };
      const result = transfiyaEnviarStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '0',
      };
      const result = transfiyaEnviarStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });

  describe('sendSmsNotification', () => {
    it('Success', () => {
      jest
        .spyOn(daleNotificationService, 'getDateInformation')
        .mockImplementation(() => mockDateInformation);
      jest
        .spyOn(daleNotificationService, 'getSmsKeys')
        .mockImplementationOnce(() => {
          return mockSmsKeys;
        });

      expect(
        transfiyaEnviarStrategy.sendSmsNotification(mockEventObject),
      ).toBeDefined();
    });
  });
});
