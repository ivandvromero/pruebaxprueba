//Libraries
import { of } from 'rxjs';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  userId,
  crmGetClient,
  crmGetProduct,
  mockEventObject,
  mockBaseTransform,
  mockGetClientOrigin,
  deviceTramaResponse,
  mockGetProductOrigin,
  mockFutureUseTransform,
  crmGetClientDestination,
  mockGetClientDestination,
  mockGetProductDestination,
  mockResultGenerateStructure,
  ConfigurationGetEnrollmentDeviceByIdResponseDecrypt,
  mockDataString,
} from '../../../test/mock-data';

//Services
import { ProviderContext } from './provider-context';

//Error Handling
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

//Enums
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';

//Providers
import { CrmService } from '../../providers/crm/crm.service';
import { UserService } from '../../providers/user/user.service';
import { DaleNotificationService } from '../../providers/dale/services/dale-notification.service';
import { EnrollmentNaturalPersonService } from '../../providers/enrollment-natural-person/enrollment-np.service';
import { CardService } from '../card/card.service';

//Strategies
import { IntrasolutionStrategy } from '../../modules/monitor/strategies/intrasolution.strategy';
import { TransfiyaEnviarStrategy } from '../../modules/monitor/strategies/transfiya-enviar.strategy';
import { TransifyaRecibirStrategy } from '../../modules/monitor/strategies/transfiya-recibir.strategy';
import { Cell2cellEnviarStrategy } from '../../modules/monitor/strategies/cell-to-cell-enviar.strategy';

describe('ProviderContext', () => {
  let service: ProviderContext;
  let spyHttpService: HttpService;
  let cacheManager: Cache;
  let crmService: CrmService;
  let userService: UserService;
  let intrasolutionStrategy: IntrasolutionStrategy;
  let enrollmentNaturalPersonService: EnrollmentNaturalPersonService;
  let daleNotificationService: DaleNotificationService;
  const mockCrmGetCli = { ...crmGetClient.data };
  const mockCrmGetCliDes = { ...crmGetClientDestination.data };
  const mockCrmGetProductOrg = { ...crmGetProduct.data };
  const mockCrmGetProdDest = { ...crmGetProduct.data };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderContext,
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
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
          }),
        },
        {
          provide: EnrollmentNaturalPersonService,
          useValue: {
            getDeviceInformation: jest
              .fn()
              .mockResolvedValue(
                ConfigurationGetEnrollmentDeviceByIdResponseDecrypt,
              ),
          },
        },
        {
          provide: CrmService,
          useValue: {
            getClientOrigin: jest.fn().mockReturnValue(mockCrmGetCli),
            getClientDestination: jest.fn().mockReturnValue(mockCrmGetCliDes),
            getProductOrigin: jest.fn().mockReturnValue(mockCrmGetProductOrg),
            getProductDestination: jest
              .fn()
              .mockReturnValue(mockCrmGetProdDest),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn(),
          },
        },
        {
          provide: DaleNotificationService,
          useValue: {
            sendSmsNotification: jest.fn(),
          },
        },
        {
          provide: CardService,
          useValue: {
            getCardAddress: jest.fn(),
          },
        },
        IntrasolutionStrategy,
        TransfiyaEnviarStrategy,
        TransifyaRecibirStrategy,
        Cell2cellEnviarStrategy,
      ],
    }).compile();

    service = module.get<ProviderContext>(ProviderContext);
    spyHttpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    crmService = module.get<CrmService>(CrmService);
    userService = module.get<UserService>(UserService);
    intrasolutionStrategy = module.get<IntrasolutionStrategy>(
      IntrasolutionStrategy,
    );
    enrollmentNaturalPersonService = module.get<EnrollmentNaturalPersonService>(
      EnrollmentNaturalPersonService,
    );
    daleNotificationService = module.get<DaleNotificationService>(
      DaleNotificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(spyHttpService).toBeDefined();
    expect(cacheManager).toBeDefined();
    expect(crmService).toBeDefined();
    expect(userService).toBeDefined();
    expect(enrollmentNaturalPersonService).toBeDefined();
    expect(daleNotificationService).toBeDefined();
  });
  describe('setStrategy', () => {
    const transactionType: string = mockEventObject.CFO.general.transactionType;
    it('Strategy Intrasolution', () => {
      const result = service.setStrategy(transactionType);
      expect(result).toBeInstanceOf(IntrasolutionStrategy);
    });
    it('Strategy EnviarDale2', () => {
      const transactionType = 'EnviarDale2_PTS_WITHDRAW_CASH_OUT';
      const result = service.setStrategy(transactionType);
      expect(result).toBeInstanceOf(TransfiyaEnviarStrategy);
    });
    it('Strategy RecibirDale2', () => {
      const transactionType = 'RecibirDale2_PTS_DEPOSIT_CASH_IN';
      const result = service.setStrategy(transactionType);
      expect(result).toBeInstanceOf(TransifyaRecibirStrategy);
    });
    it('Strategy Cell2CellEnviar', () => {
      const transactionType = 'CELL2CELL_CASHOUT_PTS_WITHDRAW_CASH_OUT';
      const result = service.setStrategy(transactionType);
      expect(result).toBeInstanceOf(Cell2cellEnviarStrategy);
    });
  });
  describe('generateStructure', () => {
    it('Success', async () => {
      const mockBaseTransf = { ...mockBaseTransform };
      const mockGetProdDest = { ...mockGetProductDestination };
      const mockEventObj = { ...mockEventObject };
      service.strategy = intrasolutionStrategy;

      const spyOnGetUser = jest
        .spyOn(userService, 'getUser')
        .mockReturnValueOnce(Promise.resolve({ data: { enrollmentId: '0' } }));
      const spyOnIntrasolutionStrategy = jest
        .spyOn(intrasolutionStrategy, 'doAlgorithm')
        .mockReturnValueOnce(Promise.resolve(mockBaseTransf));
      const spyOnStrategyIntra = jest
        .spyOn(intrasolutionStrategy, 'getProductDestination')
        .mockReturnValueOnce(Promise.resolve(mockGetProdDest));
      jest.spyOn(intrasolutionStrategy, 'getOrderer').mockReturnValue({
        name: 'Jhoon',
        secondName: '',
        lastName: 'Doe',
        cellPhone: '318-677-9266',
        phone: '318-677-9266',
        externalId: '52',
      });
      jest.spyOn(intrasolutionStrategy, 'getBeneficiary').mockReturnValue({
        name: 'Ann',
        secondName: '',
        lastName: 'Doe',
        cellPhone: '3333333333',
        phone: '3333333333',
        externalId: '53',
      });
      jest
        .spyOn(service, 'getClientDestination')
        .mockReturnValueOnce(Promise.resolve(mockGetClientDestination));
      const spyOnGetProductOrigin = jest
        .spyOn(service, 'getProductOrigin')
        .mockReturnValueOnce(Promise.resolve(mockGetProductOrigin));

      const result = await service.generateStructure(mockEventObj);
      expect(spyOnGetUser).toHaveBeenCalled();
      expect(spyOnIntrasolutionStrategy).toHaveBeenCalled();
      expect(spyOnStrategyIntra).toHaveBeenCalled();
      expect(spyOnGetProductOrigin).toHaveBeenCalled();
      expect(result).toEqual(mockResultGenerateStructure);
    });
  });
  describe('getHead', () => {
    it('Success', () => {
      const mockEventObj = { ...mockEventObject };
      const result = service.getHead(mockEventObj);
      expect(result).toBeDefined();
    });

    it('Success when data is a string', () => {
      const mockEventObj = { ...mockDataString };
      const result = service.getHead(mockEventObj);
      expect(result).toBeDefined();
    });
  });
  describe('getClientOrigin', () => {
    it('Success', async () => {
      const mockCrmGetClient = { ...crmGetClient.data };
      jest
        .spyOn(crmService, 'getClientOrigin')
        .mockReturnValueOnce(Promise.resolve(mockCrmGetClient));
      const result = await service.getClientOrigin(id, userId);
      expect(result).toEqual(mockGetClientOrigin);
    });
    it('CustomException', async () => {
      jest
        .spyOn(crmService, 'getClientOrigin')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'test'),
        );
      await expect(service.getClientOrigin(id, userId)).rejects.toThrowError(
        CustomException,
      );
    });
    it('InternalServerExceptionDale', async () => {
      jest
        .spyOn(crmService, 'getClientOrigin')
        .mockRejectedValueOnce(new Error('test'));
      try {
        await service.getClientOrigin(id, userId);
      } catch (e) {
        expect(e.response.code).toEqual('MON003');
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('getClientDestination', () => {
    const mockEventObj = { ...mockEventObject };
    it('Success', async () => {
      service.strategy = intrasolutionStrategy;
      const mockCrmGetClientDest = { ...crmGetClientDestination.data };
      jest
        .spyOn(crmService, 'getClientDestination')
        .mockReturnValue(Promise.resolve(mockCrmGetClientDest));
      const result = await service.getClientDestination(
        id,
        mockEventObj,
        intrasolutionStrategy,
        '123',
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
        service.getClientDestination(
          id,
          mockEventObj,
          intrasolutionStrategy,
          '123',
        ),
      ).rejects.toThrowError(CustomException);
    });
    it('InternalServerExceptionDale', async () => {
      jest
        .spyOn(crmService, 'getClientDestination')
        .mockRejectedValueOnce(new Error('test'));
      try {
        await service.getClientDestination(
          id,
          mockEventObj,
          intrasolutionStrategy,
          '123',
        );
      } catch (e) {
        expect(e.response.code).toEqual('MON004');
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('getProductOrigin', () => {
    const mockEventObj = { ...mockEventObject };
    const mockGetClientOrg = { ...mockGetClientOrigin };
    const externalID =
      mockEventObj.CFO.orderer.additionals.ordererBP.externalId;

    it('Success', async () => {
      const result = await service.getProductOrigin(
        externalID,
        mockEventObj,
        mockGetClientOrg,
      );
      expect(result).toEqual(mockGetProductOrigin);
    });
    it('CustomException', async () => {
      jest
        .spyOn(crmService, 'getProductOrigin')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'test'),
        );
      await expect(
        service.getProductOrigin(externalID, mockEventObj, id),
      ).rejects.toThrowError(CustomException);
    });
    it('InternalServerExceptionDale', async () => {
      jest
        .spyOn(crmService, 'getProductOrigin')
        .mockRejectedValueOnce(new Error('test'));
      try {
        await service.getProductOrigin(externalID, mockEventObj, id);
      } catch (e) {
        expect(e.response.code).toEqual('MON005');
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('getProductDestination', () => {
    const mockEventObj = { ...mockEventObject };
    const mockGetCliDest = { ...mockGetClientDestination };
    it('Success', async () => {
      const mockGetProdtDest = { ...mockGetProductDestination };
      const spyOnStrategyIntra = jest
        .spyOn(intrasolutionStrategy, 'getProductDestination')
        .mockReturnValueOnce(Promise.resolve(mockGetProdtDest));
      const result = await service.getProductDestination(
        mockEventObj,
        mockGetCliDest,
        intrasolutionStrategy,
      );
      expect(result).toEqual(mockGetProdtDest);
      expect(spyOnStrategyIntra).toHaveBeenCalled();
    });
    it('CustomException', async () => {
      jest
        .spyOn(crmService, 'getProductDestination')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'test'),
        );
      await expect(
        service.getProductDestination(
          mockEventObj,
          mockGetClientDestination,
          intrasolutionStrategy,
        ),
      ).rejects.toThrowError(CustomException);
    });
    it('InternalServerExceptionDale', async () => {
      jest
        .spyOn(crmService, 'getProductDestination')
        .mockRejectedValueOnce(new Error('test'));
      try {
        await service.getProductDestination(
          mockEventObj,
          mockGetClientDestination,
          intrasolutionStrategy,
        );
      } catch (e) {
        expect(e.response.code).toEqual('MON006');
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('getTransaction', () => {
    it('Success', async () => {
      const mockEventObj = { ...mockEventObject };
      const result = await service.getTransaction(mockEventObj);
      expect(result).toBeDefined();
    });

    it('Success when data is a string', async () => {
      const event = { ...mockDataString };
      event.RS.messageRS.responses[0].confirmations[0].data = '';
      const result = await service.getTransaction(event);
      expect(result).toBeDefined();
    });
  });
  describe('getDevice', () => {
    const mockEventObj = { ...mockEventObject };
    const cellPhone =
      mockEventObj.CFO.orderer.additionals.ordererBP.cellPhone.replace(
        /-/g,
        '',
      );
    it('Success', async () => {
      const result = await service.getDevice(id, cellPhone, mockEventObj);
      expect(result).toEqual(deviceTramaResponse);
    });
    it('CustomException', async () => {
      jest
        .spyOn(enrollmentNaturalPersonService, 'getDeviceInformation')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'test'),
        );
      await expect(
        service.getDevice(id, cellPhone, mockEventObj),
      ).rejects.toThrowError(CustomException);
    });
    it('InternalServerExceptionDale', async () => {
      jest
        .spyOn(enrollmentNaturalPersonService, 'getDeviceInformation')
        .mockRejectedValueOnce(new Error('test'));
      try {
        await service.getDevice(id, cellPhone, mockEventObj);
      } catch (e) {
        expect(e.response.code).toEqual('MON008');
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('getFutureUse', () => {
    it('Success', () => {
      const mockEventObj = { ...mockEventObject };
      const result = service.getFutureUse(mockEventObj);
      expect(result).toEqual(mockFutureUseTransform);
    });
  });
});
