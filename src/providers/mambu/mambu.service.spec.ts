import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { accountConfig } from './config/account-config';
import { MAMBU_URL, endpoints } from './constants/api';
import { MambuService } from './mambu.service';
import { of } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/common';
import {
  mockAccountDetails,
  mockAccountId,
  mockAccountName,
  mockAccountResponse,
  mockClientId,
  mockCreateAccountInMambu,
  mockHeader,
  mockProductId,
  mockSuccessResponse,
  mockUuid,
  mockCurrentAccountType,
  mockAccountNumbers,
  mockAccountDetailsByClientIdResponse,
  mockResponseObjetMambu,
  mockAccountNumbersPresent,
} from '../../../test/mock-data';

describe('mambu service', () => {
  let service: MambuService;
  let spyHttpService: any;
  let spyCache;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MambuService,
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn(),
            get: jest.fn(),
          }),
        },
        {
          provide: CACHE_MANAGER,
          useFactory: () => ({
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          }),
        },
      ],
    }).compile();

    spyHttpService = module.get(HttpService);
    spyCache = module.get(CACHE_MANAGER);
    service = module.get<MambuService>(MambuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create account function', () => {
    afterEach(() => {
      spyHttpService.post.mockClear();
      spyCache.del.mockReset();
    });

    it('should create account in Mambu, return account details and delete the cache entry', async () => {
      spyHttpService.post.mockImplementationOnce((): any => {
        return of(mockCreateAccountInMambu);
      });

      const result = await service.createAccount(
        mockClientId,
        mockProductId,
        mockCurrentAccountType,
        mockAccountName,
        mockUuid,
      );

      expect(spyHttpService.post).toHaveBeenCalledTimes(1);
      expect(spyHttpService.post).toHaveBeenCalledWith(
        `${MAMBU_URL}${endpoints.DEPOSIT_ACCOUNT}`,
        {
          accountHolderKey: mockClientId,
          productTypeKey: mockProductId,
          accountType: mockCurrentAccountType,
          name: mockAccountName,
          ...accountConfig,
        },
        {
          headers: {
            ...mockHeader.headers,
            apikey: process.env.MAMBU_API_KEY,
            'Idempotency-Key': mockUuid,
          },
        },
      );
      expect(result).toEqual(mockAccountResponse);
      expect(spyCache.del).toHaveBeenCalledTimes(1);
      expect(spyCache.del).toHaveBeenCalledWith(
        `${mockClientId}_existing_accounts`,
      );
    });
  });

  describe('fetch account details by client id function', () => {
    afterEach(() => {
      spyHttpService.get.mockClear();
    });

    it('should fetch account details by client id from Mambu', async () => {
      spyHttpService.get.mockImplementationOnce((): any => {
        return of(mockAccountDetails);
      });

      const result = await service.accountDetailsByClientId(mockClientId);
      expect(spyHttpService.get).toHaveBeenCalledTimes(1);
      expect(spyHttpService.get).toHaveBeenCalledWith(
        `${MAMBU_URL}${endpoints.DEPOSIT_ACCOUNT}`,
        {
          headers: { ...mockHeader.headers, apikey: process.env.MAMBU_API_KEY },
          params: {
            accountHolderId: mockClientId,
            accountHolderType: 'CLIENT',
          },
        },
      );
      expect(result).toEqual(mockAccountDetailsByClientIdResponse);
    });
  });

  describe('fetch account details by account id function', () => {
    afterEach(() => {
      spyHttpService.get.mockClear();
    });

    it('should fetch account details by account id from Mambu', async () => {
      spyHttpService.get.mockImplementationOnce((): any => {
        return of(mockSuccessResponse);
      });

      const result = await service.accountDetailsByAccountId(mockAccountId);
      expect(spyHttpService.get).toHaveBeenCalledTimes(1);
      expect(spyHttpService.get).toHaveBeenCalledWith(
        `${MAMBU_URL}${endpoints.DEPOSIT_ACCOUNT}/${mockAccountId}`,
        {
          headers: { ...mockHeader.headers, apikey: process.env.MAMBU_API_KEY },
        },
      );
      expect(result).toEqual(mockResponseObjetMambu);
    });
  });

  describe('fetch account numbers by client id function', () => {
    afterEach(() => {
      spyHttpService.get.mockClear();
    });

    it('should fetch account numbers by clientId from cache if present', async () => {
      spyHttpService.get.mockImplementationOnce(() => of(mockSuccessResponse));
      const result = await service.accountNumbersByClientId(mockClientId);
      expect(spyHttpService.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAccountNumbersPresent);
    });
    it('should fetch account numbers by clientId from mambu if not present in cache', async () => {
      spyHttpService.get.mockImplementationOnce((): any => {
        return of(mockAccountDetails);
      });
      const result = await service.accountNumbersByClientId(mockClientId);
      expect(spyHttpService.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAccountNumbers);
    });
  });
});
