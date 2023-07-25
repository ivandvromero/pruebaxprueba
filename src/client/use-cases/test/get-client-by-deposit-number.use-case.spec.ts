import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CoreQueryConnector,
  ICoreQueryConnector,
} from '../../common/ports/core-query-connector.interface';
import { GetClientByDepositNumberUseCase } from '../get-client-by-deposit-number.use-case';
import { clientDto, mockAccount } from '@dale/testcases/client-testcases';
import { GetClientByIdUseCase } from '../get-client-by-Id.use-case';
import { IClient } from '../../common/interfaces';

describe('GetClientByDepositNumberUseCase', () => {
  let useCase: GetClientByDepositNumberUseCase;
  let connector: ICoreQueryConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientByDepositNumberUseCase,
        {
          provide: CoreQueryConnector,
          useValue: {
            getAccountById: jest.fn().mockResolvedValue(mockAccount),
          },
        },
        {
          provide: GetClientByIdUseCase,
          useValue: {
            apply: jest.fn().mockResolvedValue(clientDto),
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

    useCase = module.get<GetClientByDepositNumberUseCase>(
      GetClientByDepositNumberUseCase,
    );
    connector = module.get<ICoreQueryConnector>(CoreQueryConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(connector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should return a client given a account id', async () => {
    //Arrange
    const depositNumber = '123';

    //act
    const client = await useCase.apply(depositNumber);

    //Assert
    expect(client).toBeDefined();
    expect(client.client).toBe(clientDto.client);
  });

  it('should call the loger when an error occurs  a client', async () => {
    //Arrange
    const depositNumber = '123';
    let client: IClient;
    jest
      .spyOn(connector, 'getAccountById')
      .mockRejectedValue(new Error('mock error'));
    //act
    try {
      client = await useCase.apply(depositNumber);
    } catch (e) {
      expect(e.status).toBe(404);
    }

    //Assert
    expect(client).toBeFalsy();
    expect(logger.debug).toHaveBeenCalled();
  });
});
