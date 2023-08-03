//Libraries
import * as rxjs from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@dale/logger-nestjs';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

//Services
import { PtsService } from '../pts/pts.service';
import { RedisService } from '../../db/redis/redis.service';
import { ContextProviderService } from './context-provider.service';
import { AccountDbService } from '../../db/accounts/account.service';
import { ConfigurationService } from '../dale/services/configuration.service';

//Strategies
import { AccountCertificateStrategy } from '../../modules/accounts/strategies/accountCertificate.strategy';

//Mock Data
import {
  inputDataMock,
  mockHeaderDto,
  getCertificateMockResponse,
  getCertificateInfoMockResponse,
} from '../../../test/mock-data';

//Error Handling
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { AdlService } from '../adl/adl.service';

describe('ContextProviderService', () => {
  let service: ContextProviderService;
  let ptsService: PtsService;
  let accountDbService: AccountDbService;
  let accountCertificateStrategy: AccountCertificateStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContextProviderService,
        PtsService,
        {
          provide: AccountDbService,
          useFactory: () => ({
            getAccountsByUserId: jest.fn(() => Promise.resolve(['27373'])),
          }),
        },
        {
          provide: CACHE_MANAGER,
          useFactory: () => ({
            get: jest.fn(),
            set: jest.fn(),
          }),
        },
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn(),
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
          }),
        },
        AccountCertificateStrategy,
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn(),
            get: jest.fn(),
          }),
        },
        {
          provide: AdlService,
          useFactory: () => ({}),
        },
        ConfigurationService,
        RedisService,
      ],
    }).compile();

    service = module.get<ContextProviderService>(ContextProviderService);
    ptsService = module.get<PtsService>(PtsService);
    accountDbService = module.get<AccountDbService>(AccountDbService);
    accountCertificateStrategy = module.get<AccountCertificateStrategy>(
      AccountCertificateStrategy,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(ptsService).toBeDefined();
    expect(accountDbService).toBeDefined();
  });
  describe('setStrategy', () => {
    it('Account Certificate Strategy', () => {
      const templateName = 'accountCertificate';
      const result = service.setStrategy(templateName);
      expect(result).toBeInstanceOf(AccountCertificateStrategy);
    });
  });
  describe('generateCertificateData', () => {
    it('Success', async () => {
      service.strategy = accountCertificateStrategy;
      const expected = { ...getCertificateInfoMockResponse };
      expected.data[expected.data.length - 1] = {
        key: 'accountOpeningDate',
        value: 27373,
      };
      expected.data[6] = {
        key: 'accountBalance',
        value: 1000000,
      };
      jest
        .spyOn(accountCertificateStrategy, 'getInfo')
        .mockReturnValueOnce(Promise.resolve(expected));
      const result = await service.generateCertificateData(
        inputDataMock,
        mockHeaderDto,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('generateCertificate', () => {
    it('Success', async () => {
      const expected = { url: getCertificateMockResponse };
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockResolvedValue({ data: { url: getCertificateMockResponse } });
      const res = await service.generateCertificate(
        getCertificateInfoMockResponse,
      );
      expect(res).toEqual(expected);
    });
    it('InternalServerExceptionDale', async () => {
      jest.spyOn(rxjs, 'lastValueFrom').mockResolvedValue(() => {
        throw new Error('test');
      });
      try {
        await service.generateCertificate(getCertificateInfoMockResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
});
