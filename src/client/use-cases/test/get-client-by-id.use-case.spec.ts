import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CoreQueryConnector,
  ICoreQueryConnector,
} from '../../common/ports/core-query-connector.interface';
import { GetClientByIdUseCase } from '../get-client-by-Id.use-case';
import { clientDto, mockAccount } from '@dale/testcases/client-testcases';
import { GetAccountByClientIdUseCase } from '../get-account-by-client-id.use-case';
import { IClient } from '../../common/interfaces';

describe('GetClientByIdUseCase', () => {
  let useCase: GetClientByIdUseCase;
  let connector: ICoreQueryConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientByIdUseCase,
        {
          provide: CoreQueryConnector,
          useValue: {
            getClientById: jest.fn().mockResolvedValue(clientDto),
          },
        },
        {
          provide: GetAccountByClientIdUseCase,
          useValue: {
            apply: jest.fn().mockResolvedValue(mockAccount),
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

    useCase = module.get<GetClientByIdUseCase>(GetClientByIdUseCase);
    connector = module.get<ICoreQueryConnector>(CoreQueryConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(connector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should return a client given a id', async () => {
    //Arrange
    const id = '987654321';

    //act
    const client = await useCase.apply(id);

    //Assert
    expect(client).toBeDefined();
    expect(client.client).toBe(clientDto.client);
  });

  it('should call the loger when ocurs a error a client given a email', async () => {
    //Arrange
    const id = '987654321';
    let client: IClient;
    jest
      .spyOn(connector, 'getClientById')
      .mockRejectedValue(new Error('mock error'));
    //act
    try {
      client = await useCase.apply(id);
    } catch (e) {
      expect(e.status).toBe(404);
    }

    //Assert
    expect(client).toBeFalsy();
    expect(logger.debug).toHaveBeenCalled();
  });
});
