import { mockAccount } from '../../../shared/testcases/client-testcases';
import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CoreQueryConnector,
  ICoreQueryConnector,
} from '../../common/ports/core-query-connector.interface';
import { GetAccountByClientIdUseCase } from '../get-account-by-client-id.use-case';
import { IAccount } from '../../common/interfaces';

describe('GetAccountByClientIdUseCase', () => {
  let useCase: GetAccountByClientIdUseCase;
  let connector: ICoreQueryConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAccountByClientIdUseCase,
        {
          provide: CoreQueryConnector,
          useValue: {
            getAccountByClientId: jest.fn().mockResolvedValue(mockAccount),
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

    useCase = module.get<GetAccountByClientIdUseCase>(
      GetAccountByClientIdUseCase,
    );
    connector = module.get<ICoreQueryConnector>(CoreQueryConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(connector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should return a account given a clientid', async () => {
    //Arrange
    const clientId = '123';

    //act
    const account = await useCase.apply(clientId);

    //Assert
    expect(account).toBeDefined();
    expect(account).toBe(mockAccount);
  });

  it('should call the loger when error occurs', async () => {
    //Arrange
    const clientId = '123';
    let account: IAccount;
    jest
      .spyOn(connector, 'getAccountByClientId')
      .mockRejectedValue(new Error('mock error'));
    //act
    try {
      account = await useCase.apply(clientId);
    } catch (e) {
      expect(e.status).toBe(404);
    }

    //Assert
    expect(account).toBeFalsy();
    expect(logger.debug).toHaveBeenCalled();
  });
});
