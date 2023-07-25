import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IFilterCriteria } from '../../../client/common/interfaces';

import {
  clientDto,
  mambuAccountMock,
  mambuMockTransaction,
  mambuRes,
  mambuTransactionChanelsMock,
  mockAccount,
  mockCreateTransactionDto,
  transactionChanelsMock,
} from '../../testcases/client-testcases';
import { AxiosAdapter } from '../http-adapters/axios-adapter';
import { TransactionMambu } from './interfaces/transaction-mambu';
import { MambuConnector } from './mambu-connector';

describe('MambuConnector', () => {
  let mambuConnector: MambuConnector;
  let configService: ConfigService;
  let http: AxiosAdapter;
  const searchArgument = 'aSearchArgument';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MambuConnector,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'apiConfigMambu'),
          },
        },
        {
          provide: AxiosAdapter,
          useValue: {
            get: jest.fn().mockImplementation(() => Promise.resolve(mambuRes)),
            post: jest
              .fn()
              .mockImplementation(() => Promise.resolve([mambuRes])),
          },
        },
      ],
    }).compile();

    mambuConnector = module.get<MambuConnector>(MambuConnector);
    configService = module.get<ConfigService>(ConfigService);
    http = module.get<AxiosAdapter>(AxiosAdapter);
  });

  it('should be defined', () => {
    expect(mambuConnector).toBeDefined();
    expect(configService).toBeDefined();
    expect(http).toBeDefined();
  });

  describe('get clients', () => {
    it('should return a client when searching by clientId', async () => {
      await expect(
        mambuConnector.getClientById(searchArgument),
      ).resolves.toEqual({
        ...clientDto,
      });
    });
    it('should return a client when searching by identification number', async () => {
      await expect(
        mambuConnector.getClientByIdentificationNumber(searchArgument),
      ).resolves.toEqual({
        ...clientDto,
      });
    });

    it('should return a client when searching by multiple fields', async () => {
      //arrange
      const filerCriteria: IFilterCriteria[] = [
        {
          field: '',
          value: '',
        },
        {
          field: '',
          value: '',
        },
      ];
      await expect(
        mambuConnector.getClientByMultipleFields(filerCriteria),
      ).resolves.toEqual({
        ...clientDto,
      });
    });
  });

  describe('get Transaction chanels', () => {
    it('should return the transaction chanels', async () => {
      //arrange
      jest.spyOn(http, 'get').mockResolvedValue(mambuTransactionChanelsMock);
      await expect(mambuConnector.getTransactionChanels()).resolves.toEqual(
        transactionChanelsMock,
      );
    });
  });

  describe('get Account', () => {
    it('should return a account by id', async () => {
      //arrange
      jest.spyOn(http, 'get').mockResolvedValue(mambuAccountMock);
      //act
      await expect(mambuConnector.getAccountById('id')).resolves.toEqual(
        mockAccount,
      );
    });

    it('should return a account by  client id', async () => {
      //arrange
      jest.spyOn(http, 'get').mockResolvedValue([mambuAccountMock]);
      //act
      await expect(mambuConnector.getAccountByClientId('id')).resolves.toEqual(
        mockAccount,
      );
    });
  });

  describe('transactions', () => {
    it('should send a transaction', async () => {
      //arrange
      jest.spyOn(http, 'post').mockResolvedValue(mambuMockTransaction);
      jest.spyOn(http, 'get').mockImplementation((url: string) => {
        if (url.includes('deposits')) {
          return Promise.resolve([]);
        } else {
          return Promise.resolve(mambuRes);
        }
      });
      //act
      const res = await mambuConnector.sendTransaction(
        mockCreateTransactionDto,
      );
      //assert
      expect(res).toBeDefined();
    });
  });

  describe('fillTransactionArray', () => {
    it('should return an empty array when no transactions are provided', async () => {
      const transaction: TransactionMambu[] = [];
      const result = await mambuConnector.fillTransactionArray(transaction);
      expect(result).toEqual([]);
    });
  });
});
