import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionByMultipleFieldsUseCase } from '../get-transactions-by-multiple-fields.use-case';

import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { PtsConnector } from '@dale/pts-connector/service/pts-connector';
import {
  filerCriteria2Mock,
  findTransactionsMockResponse,
} from '@dale/testcases/client-testcases';

describe('GetTransactionByMultipleFieldsUseCase', () => {
  let useCase: GetTransactionByMultipleFieldsUseCase;
  let connector: PtsConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionByMultipleFieldsUseCase,
        {
          provide: PtsConnector,
          useValue: {
            findTransactions: jest
              .fn()
              .mockResolvedValue([findTransactionsMockResponse]),
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

    useCase = module.get<GetTransactionByMultipleFieldsUseCase>(
      GetTransactionByMultipleFieldsUseCase,
    );
    connector = module.get<PtsConnector>(PtsConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(connector).toBeDefined();
    expect(logger).toBeDefined();
  });
  it('should return an object transactions', async () => {
    await expect(useCase.apply(filerCriteria2Mock, 1)).rejects.toThrow(
      new NotFoundException(
        ErrorCodesEnum.BOS022,
        'No se han encontrado transacciones',
      ),
    );
  });
  it('should throw an error when something wrong happen', async () => {
    jest
      .spyOn(connector, 'findTransactions')
      .mockRejectedValueOnce(new Error('Something went wrong'));

    await expect(useCase.apply(filerCriteria2Mock, 1)).rejects.toThrow(
      new NotFoundException(
        ErrorCodesEnum.BOS022,
        'No se han encontrado transacciones',
      ),
    );
  });
});
