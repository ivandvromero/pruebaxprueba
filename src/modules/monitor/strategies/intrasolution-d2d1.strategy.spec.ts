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

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

//Strategies
import { IntrasolutionD2D1Strategy } from './intrasolution-d2d1.strategy';

describe('Intrasolution dale2 to dale1 Strategy', () => {
  let intrasolutionD2D1Strategy: IntrasolutionD2D1Strategy;
  let crmService: CrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntrasolutionD2D1Strategy,
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
            getSmsKeys: jest.fn().mockReturnValue(mockSmsKeys),
          },
        },
      ],
    }).compile();
    intrasolutionD2D1Strategy = module.get<IntrasolutionD2D1Strategy>(
      IntrasolutionD2D1Strategy,
    );
    crmService = module.get<CrmService>(CrmService);
  });

  it('should be defined', () => {
    expect(intrasolutionD2D1Strategy).toBeDefined();
    expect(crmService).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      const result = await intrasolutionD2D1Strategy.doAlgorithm(
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
          Field_K7_0072: 'DPE',
          Field_K7_0075: '170000',
          Field_K7_0076: '0000008',
        },
      };
      const result = await intrasolutionD2D1Strategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = { clientDestination: {} };
      const result = await intrasolutionD2D1Strategy.getClientDestination(
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
      const result = intrasolutionD2D1Strategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result = intrasolutionD2D1Strategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
});
