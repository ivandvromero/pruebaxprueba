//Libraries
import { of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
//Mock Data
import {
  mockAuditResponse,
  mockEventObject,
  mockEventObjectReverseOrdinal,
  mockEventReverseIntraD2D2Object,
} from '../../../test/mock-data';
//Services
import { ProviderEventlogContext } from './eventlog-context';
//Error Handling
//Enums
//Providers
import { UserService } from '../user/user.service';
import { DaleNotificationService } from '../../providers/dale/services/dale-notification.service';
//Strategies
import { IntrasolutionAndReverseEventLogStrategy } from '../../modules/eventlog/strategies/intrasolution-and-reverse.strategy';
import { TransifyaEnviarEventLogStrategy } from '../../modules/eventlog/strategies/transfiya-enviar.strategy';
import { TransifyaRecibirEventLogStrategy } from '../../modules/eventlog/strategies/transfiya-recibir.strategy';
import { RetiroAtmOtpEventLogStrategy } from '../../modules/eventlog/strategies/retiro_otp.strategy';
import { ConfigurationService } from '../dale/services/configuration.service';
import { IntrasolutionD2D1AndReverseEventLogStrategy } from '../../modules/eventlog/strategies/instrasolution-d2d1-and-reverse.strategy';

describe('Provider Eventlog Context', () => {
  let service: ProviderEventlogContext;
  let userService: UserService;

  let intrasolutionStrategy: IntrasolutionAndReverseEventLogStrategy;
  let intrasolutionD2D1AndReverseEventLogStrategy: IntrasolutionD2D1AndReverseEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderEventlogContext,
        {
          provide: DaleNotificationService,
          useValue: {
            sendSmsNotification: jest.fn(),
          },
        },
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
          }),
        },
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn(),
          },
        },
        {
          provide: ConfigurationService,
          useValue: {
            getDocumentTypeById: jest.fn(),
          },
        },
        IntrasolutionAndReverseEventLogStrategy,
        TransifyaEnviarEventLogStrategy,
        TransifyaRecibirEventLogStrategy,
        RetiroAtmOtpEventLogStrategy,
        IntrasolutionD2D1AndReverseEventLogStrategy,
      ],
    }).compile();
    service = module.get<ProviderEventlogContext>(ProviderEventlogContext);
    userService = module.get<UserService>(UserService);
    intrasolutionStrategy = module.get<IntrasolutionAndReverseEventLogStrategy>(
      IntrasolutionAndReverseEventLogStrategy,
    );
    intrasolutionD2D1AndReverseEventLogStrategy =
      module.get<IntrasolutionD2D1AndReverseEventLogStrategy>(
        IntrasolutionD2D1AndReverseEventLogStrategy,
      );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });
  describe('setStrategy', () => {
    it('Strategy Intrasolution', () => {
      const result = service.setStrategy(
        'INT_TRAN_DO_DALE2_PTS_TRANSFER_DO-IT-SCUR',
      );
      expect(result).toBeInstanceOf(IntrasolutionAndReverseEventLogStrategy);
    });
    it('Strategy EnviarDale2', () => {
      const result = service.setStrategy('EnviarDale2_PTS_WITHDRAW_CASH_OUT');
      expect(result).toBeInstanceOf(TransifyaEnviarEventLogStrategy);
    });
    it('Strategy RecibirDale2', () => {
      const result = service.setStrategy('RecibirDale2_PTS_DEPOSIT_CASH_IN');
      expect(result).toBeInstanceOf(TransifyaRecibirEventLogStrategy);
    });
    it('Strategy Retiro_ATM_OTP', () => {
      const result = service.setStrategy(
        'Retiro_ATM_OTP_PTS_WITHDRAW_CASH_OUT',
      );
      expect(result).toBeInstanceOf(RetiroAtmOtpEventLogStrategy);
    });
    it('Strategy IntrasolutionD2-D1', () => {
      const result = service.setStrategy(
        'INT_TRAN_DO_D2D1_PTS_TRANSFER_DO-IT-SCUR',
      );
      expect(result).toBeInstanceOf(
        IntrasolutionD2D1AndReverseEventLogStrategy,
      );
    });
  });
  describe('generateStructure', () => {
    it('Success', async () => {
      const mockEventObj = { ...mockEventObject };
      service.strategy = intrasolutionStrategy;
      service.strategyConfig = {
        strategy: IntrasolutionAndReverseEventLogStrategy,
        typeOperator: ['debit', 'credit'],
      };
      const spyOngetAudit = jest
        .spyOn(service, 'getAudit')
        .mockReturnValue(Promise.resolve(mockAuditResponse));

      const spyOnIntrasolutionStrategyOrigin = jest
        .spyOn(intrasolutionStrategy, 'getCellPhoneOrigin')
        .mockReturnValueOnce('3186779266');

      const spyOnIntrasolutionStrategyDestiny = jest
        .spyOn(intrasolutionStrategy, 'getCellPhoneDestiny')
        .mockReturnValueOnce('3333333333');

      const result = await service.generateEventLog(mockEventObj);
      expect(spyOngetAudit).toHaveBeenCalled();
      expect(spyOnIntrasolutionStrategyOrigin).toHaveBeenCalled();
      expect(spyOnIntrasolutionStrategyDestiny).toHaveBeenCalled();
      expect(result[0]).toBeDefined();
    });
    it('Success intrasolution D2-D1 Reverse', async () => {
      const mockEventObj = { ...mockEventObject };
      mockEventObj.RS.messageRS.responses[0].confirmations.push(
        mockEventObjectReverseOrdinal,
      );
      mockEventObj.CFO.general.transactionType =
        'INT_TRAN_DO_D2D1_PTS_TRANSFER_DO-IT-SCUR';
      service.strategy = intrasolutionD2D1AndReverseEventLogStrategy;
      service.strategyConfig = {
        strategy: IntrasolutionD2D1AndReverseEventLogStrategy,
        typeOperator: ['debit', 'credit'],
      };
      const spyOngetAudit = jest
        .spyOn(service, 'getAudit')
        .mockReturnValue(Promise.resolve(mockAuditResponse));

      const spyOnIntrasolutionD2D1AndReverseEventLogStrategyOrigin = jest
        .spyOn(
          intrasolutionD2D1AndReverseEventLogStrategy,
          'getCellPhoneOrigin',
        )
        .mockReturnValueOnce('3186779266');

      const spyOnIntrasolutionD2D1AndReverseEventLogStrategyDestiny = jest
        .spyOn(
          intrasolutionD2D1AndReverseEventLogStrategy,
          'getCellPhoneDestiny',
        )
        .mockReturnValueOnce('3333333333');

      const result = await service.generateEventLog(mockEventObj);
      expect(spyOngetAudit).toHaveBeenCalled();
      expect(
        spyOnIntrasolutionD2D1AndReverseEventLogStrategyOrigin,
      ).toHaveBeenCalled();
      expect(
        spyOnIntrasolutionD2D1AndReverseEventLogStrategyDestiny,
      ).toHaveBeenCalled();
      expect(result[0]).toBeDefined();
    });
  });
  describe('getCellPhone', () => {
    it('Success event code 100', () => {
      const eventCode = 100;
      const expected = '3186779266';
      service.strategy = intrasolutionStrategy;
      const result = service.getCellPhone(mockEventObject, eventCode);
      expect(result).toEqual(expected);
    });
    it('Success event code 101', () => {
      const eventCode = 101;
      const expected = '3186779266';
      service.strategy = intrasolutionStrategy;
      const result = service.getCellPhone(mockEventObject, eventCode);
      expect(result).toEqual(expected);
    });
    it('Success event code 100 with reverse', () => {
      const eventCode = 100;
      const expected = '3186779266';
      service.strategy = intrasolutionStrategy;
      const result = service.getCellPhone(
        mockEventReverseIntraD2D2Object,
        eventCode,
      );
      expect(result).toEqual(expected);
    });
  });
});
