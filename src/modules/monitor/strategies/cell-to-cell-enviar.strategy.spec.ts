//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  mockSmsKeys,
  mockEventObject,
  mockBaseTransform,
  mockDateInformation,
  mockGetClientDestination,
} from '../../../../test/mock-data';

//Strategies
import { Cell2cellEnviarStrategy } from './cell-to-cell-enviar.strategy';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

describe('Cell to Cell Enviar Strategy', () => {
  let cell2cellEnviarStrategy: Cell2cellEnviarStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Cell2cellEnviarStrategy,
        {
          provide: DaleNotificationService,
          useValue: {
            sendSmsNotification: jest.fn(),
            getSmsKeys: jest.fn().mockReturnValue(mockSmsKeys),
            getDateInformation: jest.fn().mockReturnValue(mockDateInformation),
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
      ],
    }).compile();
    cell2cellEnviarStrategy = module.get<Cell2cellEnviarStrategy>(
      Cell2cellEnviarStrategy,
    );
  });

  it('should be defined', () => {
    expect(cell2cellEnviarStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      const result = await cell2cellEnviarStrategy.doAlgorithm(
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
      const result = await cell2cellEnviarStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = { clientDestination: {} };
      const result = await cell2cellEnviarStrategy.getClientDestination(
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
      const result = cell2cellEnviarStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '0',
      };
      const result = cell2cellEnviarStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
});
