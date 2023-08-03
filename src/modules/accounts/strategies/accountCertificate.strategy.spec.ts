//Libraries
import { HttpService } from '@nestjs/axios';
import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, CACHE_MANAGER } from '@nestjs/common';

//Services
import { PtsService } from '../../../providers/pts/pts.service';
import { AdlService } from '../../../providers/adl/adl.service';
import { AccountDbService } from '../../../db/accounts/account.service';
import { ConfigurationService } from '../../../providers/dale/services/configuration.service';

//Strategies
import { AccountCertificateStrategy } from './accountCertificate.strategy';

//Mock Data
import {
  mockHeaderDto,
  inputDataMock,
  mockAccountLimitsNew,
  getCertificateInfoMockResponse,
} from '../../../../test/mock-data';
import { ErrorCodesEnum } from '../../../shared/code-errors/error-codes.enum';

//Error Handling
import {
  NotFoundExceptionDale,
  BadRequestExceptionDale,
} from '@dale/manage-errors-nestjs';

describe('Account Certificate Strategy', () => {
  let accountCertificateStrategy: AccountCertificateStrategy;
  let ptsService: PtsService;
  let accountDbService: AccountDbService;
  let spyConfigService: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountCertificateStrategy,
        PtsService,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(),
          }),
        },
        {
          provide: AccountDbService,
          useFactory: () => ({
            getAccountsByUserId: jest.fn(() =>
              Promise.resolve([{ updateAt: 27373 }]),
            ),
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
          }),
        },
        {
          provide: CACHE_MANAGER,
          useFactory: () => ({
            get: jest.fn(),
            set: jest.fn(),
          }),
        },
        AdlService,
        {
          provide: ConfigurationService,
          useFactory: () => ({
            getDocumentTypeFullNameById: jest
              .fn()
              .mockResolvedValue('Cédula de ciudadanía'),
          }),
        },
      ],
    }).compile();
    accountCertificateStrategy = module.get<AccountCertificateStrategy>(
      AccountCertificateStrategy,
    );
    ptsService = module.get<PtsService>(PtsService);
    accountDbService = module.get<AccountDbService>(AccountDbService);
    spyConfigService = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(accountCertificateStrategy).toBeDefined();
    expect(ptsService).toBeDefined();
    expect(accountDbService).toBeDefined();
    expect(spyConfigService).toBeDefined();
  });
  describe('getInfo', () => {
    it('Success', async () => {
      const expected = { ...getCertificateInfoMockResponse };
      jest
        .spyOn(ptsService, 'get')
        .mockImplementationOnce(() => Promise.resolve(mockAccountLimitsNew));
      const result = await accountCertificateStrategy.getInfo(
        inputDataMock,
        mockHeaderDto,
      );
      expect(result).toEqual(expected);
    });
    it('BadRequestExceptionDale', async () => {
      const dataMock = { ...inputDataMock };
      dataMock.params[2].value = 'true';
      jest
        .spyOn(ptsService, 'get')
        .mockImplementationOnce(() =>
          Promise.reject(
            new BadRequestExceptionDale(
              ErrorCodesEnum.ACN018,
              'test error message',
            ),
          ),
        );
      await expect(
        accountCertificateStrategy.getInfo(dataMock, mockHeaderDto),
      ).rejects.toThrowError(NotFoundExceptionDale);
    });
    it('BadRequestException', async () => {
      const dataMock = { ...inputDataMock };
      dataMock.params[2].value = 'true';
      jest
        .spyOn(ptsService, 'get')
        .mockImplementationOnce(() =>
          Promise.reject(
            new BadRequestException(
              ErrorCodesEnum.ACN018,
              'test error message',
            ),
          ),
        );
      await expect(
        accountCertificateStrategy.getInfo(dataMock, mockHeaderDto),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
