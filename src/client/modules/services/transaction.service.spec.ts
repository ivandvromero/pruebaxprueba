import { Test, TestingModule } from '@nestjs/testing';
import {
  GetTransactionByMultipleFieldsUseCase,
  SendTransactionUseCase,
} from '../../use-cases';
import { ClientService } from './client.service';
import { TransactionService } from './transaction.service';
import {
  mockTransaction,
  clientDto,
  mockCreateTransactionDto,
  mockTransactionQuery,
  mockTransactionQuery2,
  paginationGetTransactionMock,
  findTransactionsMockResponse,
  paginationNewTransactionResponseMock,
} from '@dale/testcases/client-testcases';

describe('TransactionService', () => {
  let service: TransactionService;
  let sendTransactionUseCase: SendTransactionUseCase;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: SendTransactionUseCase,
          useValue: {
            apply: jest
              .fn()
              .mockImplementation(() => Promise.resolve(mockTransaction)),
          },
        },
        {
          provide: ClientService,
          useValue: {
            getClientHandler: jest
              .fn()
              .mockImplementation(() => Promise.resolve(clientDto)),
          },
        },
        {
          provide: GetTransactionByMultipleFieldsUseCase,
          useValue: {
            apply: jest.fn().mockResolvedValue(mockTransactionQuery2),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    sendTransactionUseCase = module.get<SendTransactionUseCase>(
      SendTransactionUseCase,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(sendTransactionUseCase).toBeDefined();
  });

  it('should manage a transaction request', async () => {
    const res = await service.sendTransaction(mockCreateTransactionDto);
    expect(res).toBeDefined();
    expect(res).toEqual(mockTransaction);
    expect(sendTransactionUseCase.apply).toBeCalled();
  });

  it('should return transactions by filter criteria', async () => {
    const res = await service.getTransactionsHandler(
      mockTransactionQuery,
      paginationGetTransactionMock,
    );
    expect(res).toEqual(paginationNewTransactionResponseMock);
    expect(res.results).toEqual([]);
  });

  it('should map transaction data correctly', () => {
    const mappedData = service.mapTransactionData([
      findTransactionsMockResponse,
    ]);
    expect(mappedData).toEqual([
      {
        amount: 20000,
        businessName: '',
        clientIdentificationNumber: '34634636',
        date: new Date('2023-06-09'),
        depositNumber: 'LG-DALE-ATH_RECAUDADORA-0000',
        fees: 0,
        gmf: 0,
        idTransactionNumber: '19623',
        originAccountId: 'LG-DALE-ATH_RECAUDADORA-0000',
        reason: 'Error de Conexión',
        receivingAccountId: '',
        state: 'PENDING_DEFERRED',
        total: 20000,
        transactionType: 'DEPOSIT',
        vat: 0,
      },
    ]);
  });
});
