import { EnrollmentService } from './../../providers/dale/services/enrollment.service';
import { SqsLogsService } from '../../providers/sqs-logs/sqs-logs.service';
import { DaleNotificationService } from './../../providers/dale/services/dale-notification.service';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { MambuService } from '../../providers/mambu/mambu.service';
import { AccountsService } from './accounts.service';
import { PtsService } from '../../providers/pts/pts.service';
import {
  mockAccountResponse,
  mockClientId,
  mockAccountState,
  mockAccountNumbers,
  mockAccountId,
  mockAccountLimitsNew,
  mockHeaderDto,
  mockAccountCreateResponse,
  headersEventMock,
  mockHeadersEvent,
  mockModifyLimitsResponse,
  mockModifyLimitsBody,
  inputDataMock,
  getCertificateMockResponse,
} from '../../../test/mock-data';
import {
  BadRequestExceptionDale,
  CustomException,
  InternalServerExceptionDale,
  OkExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/code-errors/error-codes.enum';
import { Logger } from '@dale/logger-nestjs';
import { AccountDbService } from '../../db/accounts/account.service';
import { CACHE_MANAGER } from '@nestjs/common';
import { DatabaseService } from '../../db/connection/connection.service';
import { AccountEventDto } from './dto/accounts.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { ClientKafka } from '@nestjs/microservices';
import { ContextProviderService } from '../../providers/context-provider/context-provider.service';
import { ServiceCRM } from '../../providers/crm/crm.service';

describe('AccountsService', () => {
  let service: AccountsService;
  let mambuService: MambuService;
  let ptsService: PtsService;
  let accountDbService: AccountDbService;
  let spyKafka: ClientKafka;
  let spyEnrollmentService: EnrollmentService;
  let spySqsService: SqsLogsService;
  let contextprovider: ContextProviderService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceCRM,
        AccountsService,
        MambuService,
        DatabaseService,
        {
          provide: AccountDbService,
          useFactory: () => ({
            createAccount: jest.fn(() => ({})),
            getAccountsByUserId: jest.fn(() => Promise.resolve(['27373'])),
            getOneAccountByUserIdAndAccountNumber: jest.fn(() => ({
              id: '',
              accountNumber: '',
              userId: '',
            })),
            updateAccount: jest.fn(() => ({})),
          }),
        },
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn(),
            get: jest.fn(),
          }),
        },
        PtsService,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(),
          }),
        },
        {
          provide: 'KAFKA_CLIENT',
          useValue: {
            emit: jest.fn(() => {
              return 'created';
            }),
          },
        },
        {
          provide: DaleNotificationService,
          useValue: {
            sendSmsNotification: jest.fn(),
          },
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
          provide: CACHE_MANAGER,
          useFactory: () => ({
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          }),
        },
        {
          provide: SqsLogsService,
          useFactory: () => ({
            sendMessageLog: jest.fn(),
          }),
        },
        {
          provide: EnrollmentService,
          useFactory: () => ({
            getUserDataByEnrollmentId: jest.fn().mockResolvedValue({
              person: {
                documentType: '2',
                documentNumber: '0123123123',
                expeditionDate: '1996-08-28',
                phonePrefix: '57',
                phoneNumber: '3045245250',
                gender: 2,
              },
              metadata: null,
              deviceInfo: {
                deviceId: '95DCF-5E1F-4DF-A355-2B790899',
                deviceName: 'iPhone 14 Pro',
                userAgent:
                  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                attempt: 1,
                ipAddress: '127.0.0.1',
              },
            }),
          }),
        },
        {
          provide: ContextProviderService,
          useValue: {
            setStrategy: jest.fn(),
            generateCertificateData: jest.fn(),
            generateCertificate: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<AccountsService>(AccountsService);
    mambuService = module.get<MambuService>(MambuService);
    ptsService = module.get<PtsService>(PtsService);
    accountDbService = module.get<AccountDbService>(AccountDbService);
    spyKafka = module.get('KAFKA_CLIENT');
    spyEnrollmentService = module.get<EnrollmentService>(EnrollmentService);
    spySqsService = module.get<SqsLogsService>(SqsLogsService);
    contextprovider = module.get<ContextProviderService>(
      ContextProviderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mambuService).toBeDefined();
    expect(ptsService).toBeDefined();
    expect(accountDbService).toBeDefined();
    expect(spyKafka).toBeDefined();
    expect(contextprovider).toBeDefined();
  });

  it('test accountDetailsByClientId', async () => {
    jest
      .spyOn(mambuService, 'accountDetailsByClientId')
      .mockImplementation(() => Promise.resolve([mockAccountResponse]));

    const result = await service.accountDetailsByClientId(
      mockClientId,
      mockAccountState,
    );
    expect(result).toBeInstanceOf(Array);
    expect(result).toEqual([mockAccountResponse]);
  });

  it('test accountNumbersByClientId', async () => {
    jest
      .spyOn(mambuService, 'accountNumbersByClientId')
      .mockImplementation(() => Promise.resolve(mockAccountNumbers));

    const result = await service.accountNumbersByClientId(mockClientId);
    expect(result).toEqual(mockAccountNumbers);
  });

  it('test accountDetailsByAccountId', async () => {
    const response = {
      ...mockAccountResponse,
      clientId: mockClientId,
    };

    jest
      .spyOn(mambuService, 'accountDetailsByAccountId')
      .mockImplementation(() => Promise.resolve(response));

    const result = await service.accountDetailsByAccountId(mockAccountId);
    expect(result).toEqual(response);
  });

  it('test getLimitsAccumulatorsByAccount', async () => {
    jest
      .spyOn(ptsService, 'get')
      .mockImplementation(() => Promise.resolve(mockAccountLimitsNew));

    const result = await service.getLimitsAccumulatorsByAccount(mockAccountId);
    expect(result).toEqual(mockAccountLimitsNew);
  });

  it('should return error InternalServerExceptionDale', async () => {
    jest
      .spyOn(ptsService, 'get')
      .mockImplementation(() =>
        Promise.reject(
          new BadRequestException(ErrorCodesEnum.ACN008, 'error message'),
        ),
      );
    try {
      await service.getLimitsAccumulatorsByAccount(mockAccountId);
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerExceptionDale);
    }
  });

  it('should return error CustomException', async () => {
    jest
      .spyOn(ptsService, 'get')
      .mockImplementation(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.ACN008, 'error message'),
        ),
      );
    try {
      await service.getLimitsAccumulatorsByAccount(mockAccountId);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestExceptionDale);
    }
  });

  describe('Create Account In PTS', () => {
    const responseServicePTS: any = {
      messageRS: {
        ThirdPartyData: {
          id: '',
          accountState: '',
        },
      },
      statusRS: {
        code: '',
      },
    };
    it('Create Account - Success', async () => {
      responseServicePTS.statusRS.code = '0';
      responseServicePTS.messageRS.ThirdPartyData.accountState = 'APPROVED';
      jest.spyOn(ptsService, 'createAccount').mockImplementation(() => {
        return responseServicePTS;
      });
      const response = await service.createAccountInPTS(
        {
          userId: '',
          bPartnerId: '',
          customerExternalId: '',
          phoneNumber: '',
          enrollmentId: '',
          customerExternalNumber: '',
        },
        headersEventMock,
      );
      expect(response).toEqual(true);
    });

    it('Create Account - Failed', async () => {
      responseServicePTS.statusRS.code = '2400';
      responseServicePTS.messageRS.ThirdPartyData.accountState = '';
      jest.spyOn(ptsService, 'createAccount').mockImplementation(() => {
        return responseServicePTS;
      });
      const response = await service.createAccountInPTS(
        {
          userId: '',
          bPartnerId: '',
          customerExternalId: '',
          phoneNumber: '',
          enrollmentId: '',
          customerExternalNumber: '',
        },
        headersEventMock,
      );
      expect(response).toEqual(false);
    });

    it('Create Account - Error Unknown', async () => {
      responseServicePTS.statusRS.code = '2400';
      jest.spyOn(ptsService, 'createAccount').mockImplementation(() => {
        throw new Error('Error inesperado');
      });
      try {
        await service.createAccountInPTS(
          {
            userId: '',
            bPartnerId: '',
            customerExternalId: '',
            phoneNumber: '',
            enrollmentId: '',
            customerExternalNumber: '',
          },
          headersEventMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });

    it('Create Account - Error Expectd', async () => {
      responseServicePTS.statusRS.code = '2400';
      jest.spyOn(ptsService, 'createAccount').mockImplementation(() => {
        throw new OkExceptionDale(ErrorCodesEnum.ACN001, 'detalle del error ');
      });
      try {
        await service.createAccountInPTS(
          {
            userId: '',
            bPartnerId: '',
            customerExternalId: '',
            phoneNumber: '',
            enrollmentId: '',
            customerExternalNumber: '',
          },
          headersEventMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(CustomException);
      }
    });
  });
  describe('Create Account', () => {
    const event: AccountEventDto = {
      accountId: '',
      userId: '',
      phoneNumber: '',
      enrollmentId: '',
      customerExternalId: '',
      customerExternalNumber: '',
    };
    it('Success', async () => {
      const res = await service.createAccountDb(event, headersEventMock);
      expect(res).toEqual(true);
      expect(spyKafka.emit).toHaveBeenCalled();
    });
    it('Controlled error', async () => {
      jest.spyOn(accountDbService, 'createAccount').mockImplementation(() => {
        throw new BadRequestExceptionDale(ErrorCodesEnum.ACN001, {});
      });
      try {
        await service.createAccountDb(event, headersEventMock);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
    it('Uncontrolled error', async () => {
      jest.spyOn(accountDbService, 'createAccount').mockImplementation(() => {
        throw new Error();
      });
      try {
        await service.createAccountDb(event, headersEventMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('getAccountsByUserId', () => {
    it('Success', async () => {
      const res = await service.getAccountsByUserId('22', mockHeaderDto);
      expect(res.data.length).toEqual(1);
    });
    it('error', async () => {
      jest
        .spyOn(accountDbService, 'getAccountsByUserId')
        .mockImplementation(() => {
          throw new InternalServerExceptionDale(ErrorCodesEnum.ACN001, {});
        });
      try {
        await service.getAccountsByUserId('22', mockHeaderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });

  describe('updateAccountEvent', () => {
    it('Success', async () => {
      const res = await service.updateAccountEvent(
        {
          accountId: '22',
          crmContactAgreementId: '43322',
          crmDepositId: '76766',
          userId: '77',
          enrollmentId: '',
        },
        headersEventMock,
      );
      expect(res).toEqual(true);
    });
    it('error custom dale', async () => {
      jest
        .spyOn(accountDbService, 'getOneAccountByUserIdAndAccountNumber')
        .mockImplementation(() => {
          throw new InternalServerExceptionDale(ErrorCodesEnum.ACN001, {});
        });
      try {
        await service.updateAccountEvent(
          {
            accountId: '54',
            crmContactAgreementId: '44',
            crmDepositId: '333',
            userId: '222222',
            enrollmentId: '',
          },
          headersEventMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });

    it('error', async () => {
      jest
        .spyOn(accountDbService, 'getOneAccountByUserIdAndAccountNumber')
        .mockImplementation(() => {
          throw new InternalServerErrorException('test', '');
        });
      try {
        await service.updateAccountEvent(
          {
            accountId: '546',
            crmContactAgreementId: '4234',
            crmDepositId: '339993',
            userId: '2222434522',
            enrollmentId: '',
          },
          headersEventMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });

  describe('sendSqsLog', () => {
    it('sendSqsLog - Success', async () => {
      await service.sendSqsLog('id', {}, null, {
        ...mockAccountCreateResponse,
      });
      expect(spyEnrollmentService.getUserDataByEnrollmentId).toHaveBeenCalled();
      expect(spySqsService.sendMessageLog).toHaveBeenCalled();
    });

    it('sendSqsLog - Error', async () => {
      await service.sendSqsLog(
        'id',
        {},
        {
          reponse: {
            code: '400',
          },
          message: 'testerror',
        },
        null,
      );
      expect(spyEnrollmentService.getUserDataByEnrollmentId).toHaveBeenCalled();
      expect(spySqsService.sendMessageLog).toHaveBeenCalled();
    });
  });

  describe('kafkaQueueRetry', () => {
    it('success', async () => {
      await service.kafkaQueueRetry(
        '',
        3,
        {
          value: {},
          headers: mockHeadersEvent,
        },
        '',
      );
    });

    it('max Attempts', async () => {
      const headers = mockHeadersEvent;
      headers.attempts = '6';
      await service.kafkaQueueRetry(
        '',
        3,
        {
          value: {},
          headers: headers,
        },
        '',
      );
    });
  });

  describe('insertEnrollmentQueueStepData', () => {
    it('success', async () => {
      await service.insertEnrollmentQueueStepData(
        { actions: [], data: {}, enrollmentId: '', step: '' },
        mockHeadersEvent,
      );
    });
  });
  describe('getCertificate', () => {
    it('Success', async () => {
      const expected = { url: getCertificateMockResponse };
      jest
        .spyOn(contextprovider, 'generateCertificate')
        .mockReturnValueOnce(Promise.resolve(getCertificateMockResponse));
      const result = await service.getCertificate(inputDataMock, mockHeaderDto);
      expect(result).toEqual(expected);
    });
  });
  describe('modifyLimits', () => {
    it('Success', async () => {
      jest
        .spyOn(ptsService, 'modifyLimits')
        .mockImplementationOnce(() =>
          Promise.resolve(mockModifyLimitsResponse.data),
        );
      const result = await service.modifyLimits(
        mockModifyLimitsBody,
        mockHeaderDto,
      );

      expect(result).toEqual(mockModifyLimitsResponse.data);
    });
    it('Error', async () => {
      jest.spyOn(ptsService, 'modifyLimits').mockRejectedValueOnce(() => {
        throw new Error();
      });

      await expect(
        service.modifyLimits(mockModifyLimitsBody, mockHeaderDto),
      ).rejects.toThrowError(InternalServerExceptionDale);
    });
  });
});
