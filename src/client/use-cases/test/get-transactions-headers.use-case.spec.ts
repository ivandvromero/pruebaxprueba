import { Logger } from '@dale/logger-nestjs';
import {
  CoreTransactionConnector,
  ICoreTransactionConnector,
} from '../../common/ports/core-transaction-connector.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionsWithHeadersUseCase } from '../get-transactions-headers.use-case';
import {
  filerCriteriaMock,
  transactionWithHeaders,
} from '../../../shared/testcases/client-testcases';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

describe('GetTransactionsWithHeadersUseCase', () => {
  let useCase: GetTransactionsWithHeadersUseCase;
  let connector: ICoreTransactionConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionsWithHeadersUseCase,
        {
          provide: CoreTransactionConnector,
          useValue: {
            getTransactionByMultipleFields: jest
              .fn()
              .mockResolvedValue(transactionWithHeaders),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetTransactionsWithHeadersUseCase>(
      GetTransactionsWithHeadersUseCase,
    );
    connector = module.get<ICoreTransactionConnector>(CoreTransactionConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(connector).toBeDefined();
    expect(logger).toBeDefined();
  });
  it('should return an object with headers and data', async () => {
    await expect(useCase.apply(filerCriteriaMock)).resolves.toEqual(
      transactionWithHeaders,
    );
  });
  it('should throw an error when something wrong happen', async () => {
    jest
      .spyOn(connector, 'getTransactionByMultipleFields')
      .mockRejectedValueOnce(new Error('Something went wrong'));

    await expect(useCase.apply(filerCriteriaMock)).rejects.toThrow(
      new NotFoundException(
        ErrorCodesEnum.BOS022,
        'No se han encontrado transacciones',
      ),
    );
  });
});
