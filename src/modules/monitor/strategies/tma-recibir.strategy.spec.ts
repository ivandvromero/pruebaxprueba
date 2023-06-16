//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  mockEventObject,
  mockBaseTransform,
  mockSmsKeysNoName,
  mockDateInformation,
  mockGetClientDestination,
} from '../../../../test/mock-data';

//Strategies
import { TmaRecibirStrategy } from './tma-recibir.strategy';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

describe('TMA Recibir Strategy', () => {
  let tmaRecibirStrategy: TmaRecibirStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TmaRecibirStrategy,
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
            getDateInformation: jest.fn().mockReturnValue(mockDateInformation),
            getSmsKeys: jest.fn().mockReturnValue(mockSmsKeysNoName),
          },
        },
      ],
    }).compile();
    tmaRecibirStrategy = module.get<TmaRecibirStrategy>(TmaRecibirStrategy);
  });

  it('should be defined', () => {
    expect(tmaRecibirStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      const result = await tmaRecibirStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });
  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = {
        productDestination: {
          Field_K7_0072: 'DE2',
        },
      };
      const result = await tmaRecibirStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = { clientDestination: { Field_K7_0031: '1' } };
      const result = await tmaRecibirStrategy.getClientDestination(
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
      const result = tmaRecibirStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result = tmaRecibirStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
});
