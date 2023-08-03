import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Logger } from '@dale/logger-nestjs';
import { TestingModule, Test } from '@nestjs/testing';
import { MaskingService } from '@dale/data-transformation-nestjs';
import { ErrorCustomizer } from '../../utils/customize-error';

import {
  mockAccountId,
  mockAccountState,
  mockClientId,
  mockTrackingId,
  mockDepositAccountHeader,
  mockHeaderDto,
  mockAccountLimitsNew,
  mockModifyLimitsBody,
  mockModifyLimitsResponse,
  inputDataMock,
  getCertificateMockResponse,
  expectedResponse,
  queryParams,
  headers,
} from '../../../test/mock-data';
import { DefaultErrorException } from '../../shared/custom-errors/custom-exception';
import { of } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import {
  BadRequestExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/code-errors/error-codes.enum';
import { ServiceCRM } from 'src/providers/crm/crm.service';
import { HttpService } from '@nestjs/axios';

describe('accounts controller', () => {
  let testingModule: TestingModule;
  let controller: AccountsController;
  let spyAccountsService;
  let spyKafka: ClientKafka;
  let customizeError: jest.SpyInstance;

  const mockEmit = jest.fn(() => of({}));
  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(() => of()),
          }),
        },
        ServiceCRM,
        {
          provide: AccountsService,
          useFactory: () => ({
            accountDetailsByAccountId: jest.fn(),
            accountDetailsByClientId: jest.fn(),
            accountNumbersByClientId: jest.fn(),
            getAccountsByUserId: jest.fn(() =>
              Promise.resolve({
                data: ['27373'],
              }),
            ),
            getLimitsAccumulatorsByAccount: jest.fn(() =>
              Promise.resolve(mockAccountLimitsNew),
            ),
            getCertificate: jest.fn(() =>
              Promise.resolve(getCertificateMockResponse),
            ),
            modifyLimits: jest.fn(() =>
              Promise.resolve(mockModifyLimitsResponse),
            ),
          }),
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
        {
          provide: MaskingService,
          useFactory: () => ({
            masker: jest.fn(),
          }),
        },
        ErrorCustomizer,
      ],
    }).compile();

    customizeError = jest.spyOn(
      testingModule.get(ErrorCustomizer),
      'customizeError',
    );
    controller = testingModule.get(AccountsController);
    spyAccountsService = testingModule.get(AccountsService);
    spyKafka = testingModule.get('KAFKA_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(spyAccountsService).toBeDefined();
    expect(spyKafka).toBeDefined();
  });

  describe('the fetch deposit account function with client id', () => {
    afterEach(() => {
      spyAccountsService.accountDetailsByClientId.mockClear();
    });

    it('should fetch the account details from Mambu', async () => {
      await controller.accountDetailsByClientId({
        clientId: mockClientId,
        trackingId: mockTrackingId,
        accountState: mockAccountState,
      });
      expect(spyAccountsService.accountDetailsByClientId).toHaveBeenCalledTimes(
        1,
      );
      expect(spyAccountsService.accountDetailsByClientId).toHaveBeenCalledWith(
        mockClientId,
        mockAccountState,
      );
    });
    it('should throw CustomException error in case of any error scenarios', async () => {
      spyAccountsService.accountDetailsByClientId.mockImplementationOnce(() => {
        throw new Error('test error');
      });
      try {
        await controller.accountDetailsByClientId({
          clientId: mockClientId,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(DefaultErrorException);
        expect(customizeError).toHaveBeenCalled();
      }
    });
  });

  describe('the fetch deposit account function with account id', () => {
    afterEach(() => {
      spyAccountsService.accountDetailsByAccountId.mockClear();
    });

    it('should fetch the account details from Mambu', async () => {
      await controller.accountDetailsByAccountId(
        {
          accountId: mockAccountId,
        },
        { trackingId: mockTrackingId },
        mockDepositAccountHeader,
      );
      expect(
        spyAccountsService.accountDetailsByAccountId,
      ).toHaveBeenCalledTimes(1);
      expect(spyAccountsService.accountDetailsByAccountId).toHaveBeenCalledWith(
        mockAccountId,
      );
    });
    it('should throw CustomException error in case of any error scenarios', async () => {
      spyAccountsService.accountDetailsByAccountId.mockImplementationOnce(
        () => {
          throw new Error('test error');
        },
      );
      try {
        await controller.accountDetailsByAccountId(
          {
            accountId: mockAccountId,
          },
          {},
          mockDepositAccountHeader,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(DefaultErrorException);
        expect(customizeError).toHaveBeenCalled();
      }
    });
  });
  describe('the get account numbers by clientId function', () => {
    afterEach(() => {
      spyAccountsService.accountNumbersByClientId.mockClear();
    });

    it('should fetch the account numbers for a clientId', async () => {
      await controller.accountNumbersByClientId({
        externalCustomerId: mockClientId,
      });
      expect(spyAccountsService.accountNumbersByClientId).toHaveBeenCalledTimes(
        1,
      );
      expect(spyAccountsService.accountNumbersByClientId).toHaveBeenCalledWith(
        mockClientId,
      );
    });
    it('should throw CustomException error in case of any error scenarios', async () => {
      spyAccountsService.accountNumbersByClientId.mockImplementationOnce(() => {
        throw new Error('test error');
      });
      try {
        await controller.accountNumbersByClientId({
          externalCustomerId: mockClientId,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(DefaultErrorException);
        expect(customizeError).toHaveBeenCalled();
      }
    });
  });
  describe('Fetch account limits and accumulator by Account Id', () => {
    it('should fetch the account limits from PTS', async () => {
      await controller.accountLimitsByAccountId(mockAccountId, mockHeaderDto);
      expect(
        spyAccountsService.getLimitsAccumulatorsByAccount,
      ).toHaveBeenCalledTimes(1);
      expect(
        spyAccountsService.getLimitsAccumulatorsByAccount,
      ).toHaveBeenCalledWith(mockAccountId['accountId']);
    });

    it('error in case of statusCode  === -1706', async () => {
      await limitsAccoumulatorsByAccount('-1706');
    });

    it('error in case of statusCode  === -1056', async () => {
      await limitsAccoumulatorsByAccount('-1056');
    });

    it('error in case of statusCode  === 428', async () => {
      await limitsAccoumulatorsByAccount('428');
    });

    it('error in case of statusCode not exist', async () => {
      await limitsAccoumulatorsByAccount('error');
    });

    it('error when retuen a customException', async () => {
      jest
        .spyOn(spyAccountsService, 'getLimitsAccumulatorsByAccount')
        .mockImplementation(() =>
          Promise.reject(
            new BadRequestExceptionDale(ErrorCodesEnum.ACN009, 'error message'),
          ),
        );

      try {
        await controller.accountLimitsByAccountId(mockAccountId, mockHeaderDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  const limitsAccoumulatorsByAccount = async (codeError) => {
    const response = mockAccountLimitsNew;

    jest
      .spyOn(spyAccountsService, 'getLimitsAccumulatorsByAccount')
      .mockImplementation(() => response);
    response.statusRS.code = codeError;
    try {
      await controller.accountLimitsByAccountId(mockAccountId, mockHeaderDto);
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerExceptionDale);
    }
  };

  describe('getAccountsByUserId', () => {
    it('Success', async () => {
      const response = await controller.getAccountsByUserId(
        { userId: '' },
        mockHeaderDto,
      );
      expect(response.data.length).toEqual(1);
    });
  });
  describe('getCertificate', () => {
    it('Success', async () => {
      const response = await controller.getCertificate(
        inputDataMock,
        mockHeaderDto,
      );
      expect(response).toEqual(getCertificateMockResponse);
    });
    it('Unhandle Error', async () => {
      jest
        .spyOn(spyAccountsService, 'getCertificate')
        .mockRejectedValueOnce(new Error('test'));
      await expect(
        controller.getCertificate(inputDataMock, mockHeaderDto),
      ).rejects.toThrowError(Error);
    });
    it('Custom Error', async () => {
      jest
        .spyOn(spyAccountsService, 'getCertificate')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.ACN024, 'test'),
        );
      await expect(
        controller.getCertificate(inputDataMock, mockHeaderDto),
      ).rejects.toThrowError(InternalServerExceptionDale);
    });
  });

  describe('modifyLimits', () => {
    it('Success', async () => {
      const response = await controller.modifyLimits(
        mockModifyLimitsBody,
        mockHeaderDto,
      );
      expect(Object.keys(response).length).toEqual(1);
    });
  });

  describe('consultElectronicDeposit', () => {
    it('should consult the electronic deposit and return the response', async () => {
      jest
        .spyOn(spyAccountsService, 'consultDeposit')
        .mockResolvedValue(expectedResponse);

      const result = await controller.consultElectronicDeposit(
        queryParams,
        headers,
      );
      expect(result).toEqual(expectedResponse);
      expect(spyAccountsService.consultDeposit).toHaveBeenCalledWith(
        queryParams,
      );
    });

    it('should throw InternalServerExceptionDale if an error occurs', async () => {
      const errorMessage = 'Error';
      jest
        .spyOn(spyAccountsService, 'consultDeposit')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.consultElectronicDeposit(queryParams, headers),
      ).rejects.toThrowError(InternalServerExceptionDale);
    });
  });
});
