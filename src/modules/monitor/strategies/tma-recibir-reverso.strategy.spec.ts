//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  crmGetProduct,
  mockEventObject,
  mockBaseTransform,
  mockSmsKeysNoName,
  mockDateInformation,
  crmGetClientDestination,
  mockGetClientDestination,
  mockGetProductDestination,
} from '../../../../test/mock-data';

//Strategies
import { TmaRecibirReversoStrategy } from './tma-recibir-reverso.strategy';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { CardService } from '../../../providers/card/card.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

//Const
import { transactionTypes } from '../constants/api';

//ErrorCodes
import { ErrorCodesEnum } from '../../../shared/manage-errors/code-erros/error-codes.enum';

//Exceptions
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

describe('TMA Recibir Reverso Strategy', () => {
  let tmaRecibirReversoStrategy: TmaRecibirReversoStrategy;
  let crmService: CrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TmaRecibirReversoStrategy,
        {
          provide: CrmService,
          useValue: {
            getClientDestination: jest
              .fn()
              .mockReturnValue(crmGetClientDestination.data),
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
            getSmsKeys: jest.fn().mockReturnValue(mockSmsKeysNoName),
          },
        },
        {
          provide: CardService,
          useValue: {
            getCardAddress: jest.fn(),
          },
        },
      ],
    }).compile();
    tmaRecibirReversoStrategy = module.get<TmaRecibirReversoStrategy>(
      TmaRecibirReversoStrategy,
    );
    crmService = module.get<CrmService>(CrmService);
  });

  it('should be defined', () => {
    expect(tmaRecibirReversoStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success TMA_RECEIVE', async () => {
      const eventObjectRec = { ...mockEventObject };
      eventObjectRec.CFO.general.transactionType = transactionTypes.TMA_RECEIVE;
      const result = await tmaRecibirReversoStrategy.doAlgorithm(
        mockBaseTransform,
        eventObjectRec,
      );
      expect(result).toEqual(mockBaseTransform);
    });
    it('Success TMA_REVERSE', async () => {
      const eventObjectRev = { ...mockEventObject };
      eventObjectRev.CFO.general.transactionType = transactionTypes.TMA_REVERSE;
      const response = await tmaRecibirReversoStrategy.doAlgorithm(
        mockBaseTransform,
        eventObjectRev,
      );
      expect(response).toEqual(mockBaseTransform);
    });
  });
  describe('getOrderer', () => {
    const eventObject = { ...mockEventObject };
    it('Success TMA_RECEIVE', async () => {
      eventObject.CFO.general.transactionType = transactionTypes.TMA_RECEIVE;
      const expected = {
        name: 'Ann',
        secondName: '',
        lastName: 'Doe',
        cellPhone: '3333333333',
        phone: '3333333333',
        externalId: '53',
      };
      const result = tmaRecibirReversoStrategy.getOrderer(eventObject);
      expect(result).toEqual(expected);
    });
    it('Success TMA_REVERSE', async () => {
      eventObject.CFO.general.transactionType = transactionTypes.TMA_REVERSE;
      const mockReturnValue = {
        name: 'Jhoon',
        secondName: '',
        lastName: 'Doe',
        cellPhone: '318-677-9266',
        phone: '318-677-9266',
        externalId: '52',
      };
      const result = tmaRecibirReversoStrategy.getOrderer(eventObject);
      expect(result).toEqual(mockReturnValue);
    });
  });
  describe('getBeneficiary', () => {
    const event = { ...mockEventObject };
    it('Success TMA_CASHIN_RECEIVE', async () => {
      event.CFO.general.transactionType = transactionTypes.TMA_RECEIVE;
      const receive = {
        name: 'Ann',
        secondName: '',
        lastName: 'Doe',
        cellPhone: '3333333333',
        phone: '3333333333',
        externalId: '53',
      };
      const result = tmaRecibirReversoStrategy.getBeneficiary(event);
      expect(result).toEqual(receive);
    });
    it('Success TMA_CASHIN_REVERSE', async () => {
      event.CFO.general.transactionType = transactionTypes.TMA_REVERSE;
      const mockValue = {
        name: 'Jhoon',
        secondName: '',
        lastName: 'Doe',
        cellPhone: '318-677-9266',
        phone: '318-677-9266',
        externalId: '52',
      };
      const result = tmaRecibirReversoStrategy.getBeneficiary(event);
      expect(result).toEqual(mockValue);
    });
  });
  describe('TMA getProductDestination', () => {
    const eventObject = { ...mockEventObject };
    it('Success TMA_RECEIVE', async () => {
      eventObject.CFO.general.transactionType = transactionTypes.TMA_RECEIVE;
      const result = await tmaRecibirReversoStrategy.getProductDestination(
        eventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(mockGetProductDestination);
    });
    it('Success TMA_REVERSE', async () => {
      eventObject.CFO.general.transactionType = transactionTypes.TMA_REVERSE;
      eventObject.CFO.orderer.additionals.ordererBP.cellPhone = '3333333333';
      const response = await tmaRecibirReversoStrategy.getProductDestination(
        eventObject,
        mockGetClientDestination,
      );
      expect(response).toEqual(mockGetProductDestination);
    });
    it('Success not found items', async () => {
      const products = { ...crmGetProduct };
      const response = { ...mockGetProductDestination };
      response.productDestination.Field_K7_0077 = 0;
      response.productDestination.Field_K7_0079 = '5';
      products.data.items = [];
      jest
        .spyOn(crmService, 'getClientDestination')
        .mockReturnValueOnce(Promise.resolve(products.data));
      const result = await tmaRecibirReversoStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(response);
    });
    it('Error CustomException', async () => {
      jest
        .spyOn(crmService, 'getProductDestination')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'Error'),
        );
      await expect(
        tmaRecibirReversoStrategy.getProductDestination(mockEventObject, id),
      ).rejects.toThrowError(CustomException);
    });
    it('Error InternalServerExceptionDale', async () => {
      jest
        .spyOn(crmService, 'getProductDestination')
        .mockRejectedValueOnce(new Error('Error'));
      try {
        await tmaRecibirReversoStrategy.getProductDestination(
          mockEventObject,
          id,
        );
      } catch (e) {
        expect(e.response.code).toEqual('MON006');
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('TMA getClientDestination', () => {
    it('Success Client Destination', async () => {
      const response = await tmaRecibirReversoStrategy.getClientDestination(
        id,
        mockEventObject,
        '123',
      );
      expect(response).toEqual(mockGetClientDestination);
    });
    it('CustomException Client Destination', async () => {
      jest
        .spyOn(crmService, 'getClientDestination')
        .mockRejectedValueOnce(
          new InternalServerExceptionDale(ErrorCodesEnum.MON000, 'Error'),
        );
      await expect(
        tmaRecibirReversoStrategy.getClientDestination(
          id,
          mockEventObject,
          '123',
        ),
      ).rejects.toThrowError(CustomException);
    });
    it('InternalServerExceptionDale Client Destination', async () => {
      jest
        .spyOn(crmService, 'getClientDestination')
        .mockRejectedValueOnce(new Error('Error'));
      try {
        await tmaRecibirReversoStrategy.getClientDestination(
          id,
          mockEventObject,
          '123',
        );
      } catch (e) {
        expect(e.response.code).toEqual('MON004');
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
});
