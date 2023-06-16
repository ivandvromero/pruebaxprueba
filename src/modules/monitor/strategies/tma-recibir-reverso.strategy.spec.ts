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
import { TmaRecibirReversoStrategy } from './tma-recibir-reverso.strategy';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

describe('TMA Recibir Reverso Strategy', () => {
  let tmaRecibirReversoStrategy: TmaRecibirReversoStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TmaRecibirReversoStrategy,
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
    tmaRecibirReversoStrategy = module.get<TmaRecibirReversoStrategy>(
      TmaRecibirReversoStrategy,
    );
  });

  it('should be defined', () => {
    expect(tmaRecibirReversoStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      const result = await tmaRecibirReversoStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
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
      const result = tmaRecibirReversoStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });

  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = {
        productDestination: {
          Field_K7_0072: 'D',
        },
      };
      const result = await tmaRecibirReversoStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result = tmaRecibirReversoStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = { clientDestination: { Field_K7_0031: '' } };
      const result = await tmaRecibirReversoStrategy.getClientDestination(
        id,
        mockEventObject,
      );
      expect(result).toEqual(expected);
    });
  });
});
