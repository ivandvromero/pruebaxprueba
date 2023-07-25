//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  mockEventObject,
  mockBaseTransform,
  mockGetClientDestination,
  mockDateInformation,
  mockSmsKeys,
} from '../../../../test/mock-data';

//Strategies
import { TransifyaRecibirStrategy } from './transfiya-recibir.strategy';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { DynamoDBService } from '../../../providers/dale/services/dynamodb.service';
import { Logger } from '@dale/logger-nestjs';
import { of } from 'rxjs';

describe('Transifya Recibir Strategy', () => {
  let transifyaRecibirStrategy: TransifyaRecibirStrategy;
  let daleNotificationService: DaleNotificationService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransifyaRecibirStrategy,
        {
          provide: DaleNotificationService,
          useValue: {
            getDateInformation: jest.fn().mockReturnValue(mockDateInformation),
            getSmsKeys: jest.fn().mockReturnValue(mockSmsKeys),
            sendSmsNotification: jest.fn(),
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
    transifyaRecibirStrategy = module.get<TransifyaRecibirStrategy>(
      TransifyaRecibirStrategy,
    );
    daleNotificationService = module.get<DaleNotificationService>(
      DaleNotificationService,
    );
    logger = module.get<Logger>(Logger);

    transifyaRecibirStrategy = new TransifyaRecibirStrategy(
      null, // Coloca aquí la instancia del CrmService (puedes utilizar null o una instancia mock si no es relevante para esta prueba)
      daleNotificationService,
      logger,
    );
  });

  it('should be defined', () => {
    expect(transifyaRecibirStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      jest
        .spyOn(transifyaRecibirStrategy, 'sendSmsNotification')
        .mockImplementation(() => Promise.resolve());
      const result = await transifyaRecibirStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });
  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = { productDestination: {} };
      const result = await transifyaRecibirStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = {
        clientDestination: { Field_K7_0036: 'accountID' }
      };
      const result = await transifyaRecibirStrategy.getClientDestination(
        id,
        mockEventObject,
      );
      expect(result).toEqual(expected);
    });

    it('Success - when cellPhone start whit 57', async () => {
      const expected = {
        clientDestination: { Field_K7_0036: 'accountID' }
      };
      let event = {...mockEventObject};
      event.CFO.additionals.sourceDetails.sourceAccount = '57accountID';
      const result = await transifyaRecibirStrategy.getClientDestination(
        id,
        event,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getOrderer', () => {
    it('Success', async () => {
      const expected = {
        cellPhone: '3333333333',
        externalId: '53',
        lastName: 'Doe',
        name: 'Ann',
        phone: '3333333333',
        secondName: '',
      };
      const result = transifyaRecibirStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result = transifyaRecibirStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });

  describe('sendSmsNotification', () => {
    it('Success', async () => {
      await expect(
        transifyaRecibirStrategy.sendSmsNotification(mockEventObject),
      ).resolves.toBeUndefined();
    });
  });
});
