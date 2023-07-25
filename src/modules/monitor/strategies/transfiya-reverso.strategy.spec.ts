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
} from '../../../../test/mock-data';

//Strategies
import { TransfiyaReversoStrategy } from './transfiya-reverso.strategy';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Logger } from '@dale/logger-nestjs';

describe('Transfiya Enviar Reverso Strategy', () => {
  let transfiyaReversoStrategy: TransfiyaReversoStrategy;
  let crmService: CrmService;
  let daleNotificationService: DaleNotificationService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfiyaReversoStrategy,
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
          provide: DaleNotificationService,
          useValue: {
            sendSmsNotification: jest.fn(),
            getDateInformation: jest.fn(),
            getSmsKeys: jest.fn(),
          },
        },
      ],
    }).compile();
    transfiyaReversoStrategy = module.get<TransfiyaReversoStrategy>(
      TransfiyaReversoStrategy,
    );
    crmService = module.get<CrmService>(CrmService);
    daleNotificationService = module.get<DaleNotificationService>(
      DaleNotificationService,
    );

    transfiyaReversoStrategy = new TransfiyaReversoStrategy(
      null,
      daleNotificationService,
      logger,
    );
  });

  it('should be defined', () => {
    expect(transfiyaReversoStrategy).toBeDefined();
    expect(crmService).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      jest
        .spyOn(transfiyaReversoStrategy, 'sendSmsNotification')
        .mockImplementation(() => Promise.resolve());
      const result = await transfiyaReversoStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });
  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = { productDestination: {} };
      const result = await transfiyaReversoStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = { clientDestination: {} };
      const result = await transfiyaReversoStrategy.getClientDestination(
        id,
        mockEventObject,
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
      const result = transfiyaReversoStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result = transfiyaReversoStrategy.getBeneficiary(mockEventObject);
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

      await transfiyaReversoStrategy.sendSmsNotification(
        mockEventObject,
      );
      expect(
        daleNotificationService.getDateInformation,
      ).toHaveBeenCalledTimes(1);
      expect(daleNotificationService.getSmsKeys).toHaveBeenCalledTimes(1);
      expect(
        daleNotificationService.sendSmsNotification,
      ).toHaveBeenCalledTimes(1);
    });
  });
});