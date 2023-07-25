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
import { Cell2cellEnviarReversoStrategy } from './cell-to-cell-enviar-reverso.strategy';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

describe('Cell2Cell Recibir Strategy', () => {
  let cell2cellEnviarReversoStrategy: Cell2cellEnviarReversoStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Cell2cellEnviarReversoStrategy,
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
    cell2cellEnviarReversoStrategy = module.get<Cell2cellEnviarReversoStrategy>(
      Cell2cellEnviarReversoStrategy,
    );
  });

  it('should be defined', () => {
    expect(cell2cellEnviarReversoStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      const result = await cell2cellEnviarReversoStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });
  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = {};
      const result = await cell2cellEnviarReversoStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = {};
      const result = await cell2cellEnviarReversoStrategy.getClientDestination(
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
      const result = cell2cellEnviarReversoStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result =
        cell2cellEnviarReversoStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
});
