import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../services/transaction.service';
import { TransactionController } from './transaction.controller';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';
import { DynamodbModule } from '@dale/aws-nestjs';
import { LoggerModule } from '@dale/logger-nestjs';
import { CACHE_MANAGER } from '@nestjs/common';
import {
  mockTransaction,
  mockTransactionQuery,
  paginationGetTransactionMock,
} from '@dale/testcases/client-testcases';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            getTransactionsHandler: jest
              .fn()
              .mockResolvedValue([mockTransaction]),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
            reset: jest.fn(),
          },
        },
      ],
      imports: [
        DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
        LoggerModule.forRoot({ context: 'Client Module' }),
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return transactions by filter criteria', async () => {
    const res = await service.getTransactionsHandler(
      mockTransactionQuery,
      paginationGetTransactionMock,
    );
    const response = await controller.getTransaction(
      mockTransactionQuery,
      paginationGetTransactionMock,
    );
    expect(res).toBeDefined();
    expect(response).toBe(res);
  });
});
