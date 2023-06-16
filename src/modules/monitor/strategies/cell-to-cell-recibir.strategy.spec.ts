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
import { Cell2cellRecibirStrategy } from './cell-to-cell-recibir.strategy';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

describe('Cell2Cell Recibir Strategy', () => {
  let cell2cellRecibirStrategy: Cell2cellRecibirStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Cell2cellRecibirStrategy,
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
    cell2cellRecibirStrategy = module.get<Cell2cellRecibirStrategy>(
      Cell2cellRecibirStrategy,
    );
  });

  it('should be defined', () => {
    expect(cell2cellRecibirStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      const result = await cell2cellRecibirStrategy.doAlgorithm(
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
          Field_K7_0075: '123',
          Field_K7_0076: 'beneficiaryAccount',
        },
      };
      const result = await cell2cellRecibirStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = { clientDestination: {} };
      const result = await cell2cellRecibirStrategy.getClientDestination(
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
      const result = cell2cellRecibirStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result = cell2cellRecibirStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
});
