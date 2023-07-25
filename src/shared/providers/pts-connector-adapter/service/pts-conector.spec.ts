import { ConfigService } from '@nestjs/config';
import { PtsConnector } from './pts-connector';
import { Test, TestingModule } from '@nestjs/testing';
import {
  filerCriteria2Mock,
  findTransactionsMockResponse,
  mockResponseTransactionPts,
  mockSendTransactionPtsDto,
} from '../../../testcases/client-testcases';
import { AxiosAdapter } from '@dale/http-adapters/axios-adapter';
import { PtsTokenManager } from './token-manager.service';

describe('PtsConnector', () => {
  let ptsConnector: PtsConnector;
  let configService: ConfigService;
  let http: AxiosAdapter;
  let ptsTokenManager: PtsTokenManager;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PtsConnector,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'apiConfigPts'),
          },
        },
        {
          provide: AxiosAdapter,
          useValue: {
            get: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(mockResponseTransactionPts),
              ),
            post: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve([mockResponseTransactionPts]),
              ),
          },
        },
        {
          provide: PtsTokenManager,
          useValue: {
            getToken: jest.fn().mockImplementation(),
          },
        },
      ],
    }).compile();

    ptsConnector = module.get<PtsConnector>(PtsConnector);
    configService = module.get<ConfigService>(ConfigService);
    http = module.get<AxiosAdapter>(AxiosAdapter);
    ptsTokenManager = module.get<PtsTokenManager>(PtsTokenManager);
  });

  it('should be defined', () => {
    expect(ptsConnector).toBeDefined();
    expect(configService).toBeDefined();
    expect(http).toBeDefined();
    expect(ptsTokenManager).toBeDefined();
  });

  describe('transaction', () => {
    it('should send a transaction', async () => {
      // arrange
      jest.spyOn(http, 'post').mockResolvedValue(mockResponseTransactionPts);
      // act
      const result = await ptsConnector.dispatchTransaction(
        mockSendTransactionPtsDto,
      );
      //assert
      expect(result).toBeDefined();
    });

    it('should get a transaction', async () => {
      jest.spyOn(http, 'post').mockResolvedValue(findTransactionsMockResponse);
      const result = await ptsConnector.findTransactions(filerCriteria2Mock, 1);
      expect(result).toBeDefined();
    });
  });
});
