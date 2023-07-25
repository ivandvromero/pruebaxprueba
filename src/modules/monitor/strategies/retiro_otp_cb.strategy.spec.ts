//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  mockEventObject,
  mockBaseTransform,
  mockGetClientDestination,
  mockEmptyClientdestination,
  mockDateInformation,
  mockSmsKeys,
  mockSmsKeysNoName,
  mockEmptyProductDestination,
} from '../../../../test/mock-data';

//Strategies
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Logger } from '@dale/logger-nestjs';
import { DynamoDBService } from '../../../providers/dale/services/dynamodb.service';
import { of } from 'rxjs';
import { RetiroOtpCbStrategy } from './retiro_otp_cb.strategy';
import { CrmService } from '../../../providers/crm/crm.service';

describe('RetiroOtpCbStrategy', () => {
  let retiroOtpCbStrategy: RetiroOtpCbStrategy;
  let daleNotificationService: DaleNotificationService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetiroOtpCbStrategy,
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
        {
          provide: DaleNotificationService,
          useValue: {
            getDateInformation: jest.fn().mockReturnValue(mockDateInformation),
            getSmsKeys: jest.fn().mockReturnValue(mockSmsKeys),
            sendSmsNotification: jest.fn(),
          },
        },
        {
          provide: CrmService,
          useValue: {
            getClientOrigin: jest.fn(),
            getClientDestination: jest.fn(),
            getProductOrigin: jest.fn(),
            getProductDestination: jest.fn(),
          },
        },
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
          }),
        },
      ],
    }).compile();
    retiroOtpCbStrategy = module.get<RetiroOtpCbStrategy>(RetiroOtpCbStrategy);
    logger = module.get<Logger>(Logger);
    daleNotificationService = module.get<DaleNotificationService>(
      DaleNotificationService,
    );

    retiroOtpCbStrategy = new RetiroOtpCbStrategy(
      null,
      daleNotificationService,
      logger,
    );
  });

  it('should be defined', () => {
    expect(retiroOtpCbStrategy).toBeDefined();
  });

  describe('doAlgorithm', () => {
    it('Success', async () => {
      jest
        .spyOn(retiroOtpCbStrategy, 'sendSmsNotification')
        .mockImplementation(() => Promise.resolve());
      const result = await retiroOtpCbStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });

  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = {
        productDestination: mockEmptyProductDestination,
      };
      const result = await retiroOtpCbStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('getClientDestination', () => {
    it('Success', async () => {
      const clientDestination = {
        ...mockEmptyClientdestination,
        Field_K7_0042: '01',
      };
      const result = await retiroOtpCbStrategy.getClientDestination(
        id,
        mockEventObject,
      );
      expect(result).toEqual({ clientDestination });
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
      const result = retiroOtpCbStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });

  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '0',
      };
      const result = retiroOtpCbStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });

  describe('sendSmsNotification', () => {
    it('should send SMS notification if status code is 0', async () => {
      jest
        .spyOn(daleNotificationService, 'sendSmsNotification')
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(daleNotificationService, 'getDateInformation')
        .mockReturnValue(mockDateInformation);
      jest
        .spyOn(daleNotificationService, 'getSmsKeys')
        .mockReturnValue(mockSmsKeysNoName);

      await retiroOtpCbStrategy.sendSmsNotification(mockEventObject);
      expect(daleNotificationService.getDateInformation).toHaveBeenCalledTimes(
        1,
      );
      expect(daleNotificationService.getSmsKeys).toHaveBeenCalledTimes(1);
      expect(daleNotificationService.sendSmsNotification).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should call logger', async () => {
      jest
        .spyOn(daleNotificationService, 'sendSmsNotification')
        .mockImplementation(() => Promise.reject());
      jest
        .spyOn(daleNotificationService, 'getDateInformation')
        .mockReturnValue(mockDateInformation);
      jest
        .spyOn(daleNotificationService, 'getSmsKeys')
        .mockReturnValue(mockSmsKeysNoName);
      jest.spyOn(logger, 'error').mockImplementation();

      try {
        await retiroOtpCbStrategy.sendSmsNotification(mockEventObject);
      } catch (error) {
        expect(
          daleNotificationService.getDateInformation,
        ).toHaveBeenCalledTimes(1);
        expect(daleNotificationService.getSmsKeys).toHaveBeenCalledTimes(1);
        expect(logger.error).toHaveBeenCalledTimes(1);
      }
    });
  });
});
