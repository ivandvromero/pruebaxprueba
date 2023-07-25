import { SendTransactionUseCase } from '../send-transaction.use-case';

import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  createTransaction,
  createTransactionPts,
  mockTransactionPts,
} from '../../../shared/testcases/client-testcases';
import { PtsConnector } from '@dale/pts-connector/service/pts-connector';

describe('SenTransactionUseCase', () => {
  let useCase: SendTransactionUseCase;
  let connector: PtsConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendTransactionUseCase,
        {
          provide: PtsConnector,
          useValue: {
            dispatchTransaction: jest
              .fn()
              .mockResolvedValue(mockTransactionPts),
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

    useCase = module.get<SendTransactionUseCase>(SendTransactionUseCase);
    connector = module.get<PtsConnector>(PtsConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(connector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should send a new transaction a return', async () => {
    //act
    const res = await useCase.apply(createTransactionPts);
    expect(res).toBeDefined();
    expect(res).toBe(mockTransactionPts);
  });

  it('should call the loger when  a error ocurs', async () => {
    jest
      .spyOn(connector, 'dispatchTransaction')
      .mockRejectedValue(new Error('mock error'));
    //act
    try {
      await useCase.apply(createTransaction);
    } catch (e) {
      expect(logger.debug).toHaveBeenCalled();
    }
  });
});
