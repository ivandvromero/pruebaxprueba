import { transactionChanelsMock } from '../../../shared/testcases/client-testcases';
import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CoreQueryConnector,
  ICoreQueryConnector,
} from '../../common/ports/core-query-connector.interface';
import { GetTransactionChanelsUseCase } from '../get-transaction-chanels.use-case';
import { ITransactionChanel } from '../../common/interfaces';

describe('GetTransactionChanelsUseCase', () => {
  let useCase: GetTransactionChanelsUseCase;
  let connector: ICoreQueryConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionChanelsUseCase,
        {
          provide: CoreQueryConnector,
          useValue: {
            getTransactionChanels: jest
              .fn()
              .mockResolvedValue(transactionChanelsMock),
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

    useCase = module.get<GetTransactionChanelsUseCase>(
      GetTransactionChanelsUseCase,
    );
    connector = module.get<ICoreQueryConnector>(CoreQueryConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(connector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should return a array of transaction chanels', async () => {
    //act
    const chanels: ITransactionChanel[] = await useCase.apply();

    //Assert
    expect(chanels).toBeDefined();
    expect(chanels.length).toBe(transactionChanelsMock.length);
  });

  it('should call the loger when  a error ocurs', async () => {
    jest
      .spyOn(connector, 'getTransactionChanels')
      .mockRejectedValue(new Error('mock error'));
    //act
    const chanels = await useCase.apply();

    //Assert
    expect(chanels).toBeFalsy();
    expect(logger.debug).toHaveBeenCalled();
  });
});
