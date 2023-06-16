//Libraries
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

//Enums
import { ErrorCodesEnum } from '../../../shared/manage-errors/code-erros/error-codes.enum';

//Error Handling
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

//Mock Data
import {
  id,
  mockSmsKeys,
  crmGetClient,
  crmGetProduct,
  mockEventObject,
  mockBaseTransform,
  mockDateInformation,
  crmGetClientDestination,
  mockGetClientDestination,
  mockGetProductDestination,
  ConfigurationGetEnrollmentDeviceByIdResponseDecrypt,
} from '../../../../test/mock-data';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

//Strategies
import { IntrasolutionStrategy } from './intrasolution.strategy';

describe('Intrasolution Strategy', () => {
  let intrasolutionStrategy: IntrasolutionStrategy;
  let crmService: CrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntrasolutionStrategy,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest
              .fn()
              .mockReturnValue(
                ConfigurationGetEnrollmentDeviceByIdResponseDecrypt,
              ),
            set: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(() =>
              of(ConfigurationGetEnrollmentDeviceByIdResponseDecrypt),
            ),
          }),
        },
        {
          provide: CrmService,
          useValue: {
            getClientOrigin: jest.fn().mockReturnValue(crmGetClient.data),
            getClientDestination: jest
              .fn()
              .mockReturnValue(crmGetClientDestination.data),
            getProductOrigin: jest.fn().mockReturnValue(crmGetProduct.data),
            getProductDestination: jest
              .fn()
              .mockReturnValue(crmGetProduct.data),
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
    intrasolutionStrategy = module.get<IntrasolutionStrategy>(
      IntrasolutionStrategy,
    );
    crmService = module.get<CrmService>(CrmService);
  });

  it('should be defined', () => {
    expect(intrasolutionStrategy).toBeDefined();
    expect(crmService).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      const result = await intrasolutionStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });
  describe('getProductDestination', () => {
    it('Success', async () => {
      const result = await intrasolutionStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(mockGetProductDestination);
    });
    it('Success without items in client', async () => {
      const product = { ...crmGetProduct };
      const expected = { ...mockGetProductDestination };
      expected.productDestination.Field_K7_0077 = 0;
      expected.productDestination.Field_K7_0079 = '5';
      product.data.items = [];
      jest
        .spyOn(crmService, 'getClientDestination')
        .mockReturnValueOnce(Promise.resolve(product.data));
      const result = await intrasolutionStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
    it('CustomException', async () => {
      jest
        .spyOn(crmService, 'getProductDestination')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'test'),
        );
      await expect(
        intrasolutionStrategy.getProductDestination(mockEventObject, id),
      ).rejects.toThrowError(CustomException);
    });
    it('InternalServerExceptionDale', async () => {
      jest
        .spyOn(crmService, 'getProductDestination')
        .mockRejectedValueOnce(new Error('test'));
      try {
        await intrasolutionStrategy.getProductDestination(mockEventObject, id);
      } catch (e) {
        expect(e.response.code).toEqual('MON006');
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const result = await intrasolutionStrategy.getClientDestination(
        id,
        mockEventObject,
      );
      expect(result).toEqual(mockGetClientDestination);
    });
    it('CustomException', async () => {
      jest
        .spyOn(crmService, 'getClientDestination')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'test'),
        );
      await expect(
        intrasolutionStrategy.getClientDestination(id, mockEventObject),
      ).rejects.toThrowError(CustomException);
    });
    it('InternalServerExceptionDale', async () => {
      jest
        .spyOn(crmService, 'getClientDestination')
        .mockRejectedValueOnce(new Error('test'));
      try {
        await intrasolutionStrategy.getClientDestination(id, mockEventObject);
      } catch (e) {
        expect(e.response.code).toEqual('MON004');
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
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
      const result = intrasolutionStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        cellPhone: '3333333333',
        externalId: '53',
        lastName: 'Doe',
        name: 'Ann',
        phone: '3333333333',
        secondName: '',
      };
      const result = intrasolutionStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
});
