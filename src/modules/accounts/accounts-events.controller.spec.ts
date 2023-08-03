import { Test, TestingModule } from '@nestjs/testing';
import { AccountsEventsController } from './accounts-events.controller';
import { Logger } from '@dale/logger-nestjs';
import { of } from 'rxjs';
import { mockAccountId } from '../../../test/mock-data';
import { AccountsService } from './accounts.service';
import { AccountEventDto, AccountPTSEventDto } from './dto/accounts.dto';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { mapKafkaHeadersToDto } from 'src/shared/utils/map-kafka-headers-to-dto';

describe('AccountsEventsController', () => {
  let controller: AccountsEventsController;
  let spyAccountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsEventsController],
      providers: [
        {
          provide: AccountsService,
          useFactory: () => ({
            createAccountDb: jest.fn((x) => {
              if (x.accountId == '20000155') return true;
              else return Promise.resolve(mockAccountId);
            }),
            createAccountInPTS: jest.fn((x) => {
              if (x.userId == '79b145b9-c0cc-4af2-a772-6239523e23f8')
                return true;
            }),

            updateAccountEvent: jest.fn(() => Promise.resolve(true)),
            kafkaQueueRetry: jest.fn(),
            insertEnrollmentQueueStepData: jest.fn(),
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
      ],
    }).compile();

    controller = module.get<AccountsEventsController>(AccountsEventsController);
    spyAccountsService = module.get(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listenEventCreateAccountinPTS', () => {
    const request: AccountPTSEventDto = {
      userId: '79b145b9-c0cc-4af2-a772-6239523e23f8',
      bPartnerId: '',
      customerExternalId: '',
      customerExternalNumber: '',
      enrollmentId: '',
      phoneNumber: '',
    };
    it('Success', async () => {
      const response = await controller.listenEventCreateAccountInPTS(request);
      expect(response).toEqual(true);
    });

    it('Failure', async () => {
      jest
        .spyOn(spyAccountsService, 'createAccountInPTS')
        .mockImplementationOnce(() => {
          throw new InternalServerExceptionDale('00', 'Error test');
        });
      const response = await controller.listenEventCreateAccountInPTS(request);
      expect(response).toEqual(true);
    });
  });

  describe('listenEventCreateAccountDB', () => {
    const request: AccountEventDto = {
      accountId: '20000155',
      userId: '',
      phoneNumber: '123456789',
      enrollmentId: '123',
      customerExternalId: '',
      customerExternalNumber: '',
    };
    it('Create Account in DB - Success', async () => {
      const response = await controller.listenEventCreateAccountDB(request);
      expect(response).toEqual(true);
    });

    it('createAccountInDB - Failure', async () => {
      jest
        .spyOn(spyAccountsService, 'createAccountDb')
        .mockImplementationOnce(() => {
          throw new InternalServerExceptionDale('0', 'Error Test');
        });
      const result = await controller.listenEventCreateAccountDB(request);
      expect(result).toEqual(true);
    });
  });

  describe('updateAccountEvent', () => {
    it('Success', async () => {
      const response = await controller.listenEventUpdateAccountEvent({
        userId: '',
        accountId: '',
        crmContactAgreementId: '',
        crmDepositId: '',
        enrollmentId: '',
      });
      expect(response).toEqual(true);
    });
    it('Failure', async () => {
      jest
        .spyOn(spyAccountsService, 'updateAccountEvent')
        .mockImplementationOnce(() => {
          throw new InternalServerExceptionDale('0', 'Error Test');
        });
      const result = await controller.listenEventUpdateAccountEvent({
        userId: '',
        accountId: '',
        crmContactAgreementId: '',
        crmDepositId: '',
        enrollmentId: '',
      });
      expect(result).toEqual(true);
    });
  });
  it('mapKafkaHeadersToDto success', async () => {
    const result = mapKafkaHeadersToDto({});
    expect(result).toEqual(result);
    const result2 = mapKafkaHeadersToDto({
      transactionId: 'abc',
      channelId: '',
      sessionId: '',
      timestamp: '',
      ipAddress: '',
      application: '',
      attempts: '',
    });
    expect(result2).toEqual(result2);
  });
});
