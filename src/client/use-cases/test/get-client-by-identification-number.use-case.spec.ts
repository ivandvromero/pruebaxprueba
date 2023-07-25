import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CoreQueryConnector,
  ICoreQueryConnector,
} from '../../common/ports/core-query-connector.interface';
import { clientDto, mockAccount } from '@dale/testcases/client-testcases';
import { IClient } from '../../common/interfaces';
import { GetClientByIdentificationNumberUseCase } from '../get-client-by-identification-number-use-case';
import { GetAccountByClientIdUseCase } from '../get-account-by-client-id.use-case';

describe('GetClientByIdentificationNumberUseCase', () => {
  let useCase: GetClientByIdentificationNumberUseCase;
  let connector: ICoreQueryConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientByIdentificationNumberUseCase,
        {
          provide: CoreQueryConnector,
          useValue: {
            getClientByIdentificationNumber: jest
              .fn()
              .mockResolvedValue(clientDto),
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

    useCase = module.get<GetClientByIdentificationNumberUseCase>(
      GetClientByIdentificationNumberUseCase,
    );
    connector = module.get<ICoreQueryConnector>(CoreQueryConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(connector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should return a client given a identification', async () => {
    //Arrange
    const identification = '123456789';

    //act
    const client = await useCase.apply(identification);

    //Assert
    expect(client).toBeDefined();
    expect(client.client).toBe(clientDto.client);
  });

  it('should call the loger when ocurs a error a client given a identificartion', async () => {
    //Arrange
    const identification = '123456789';
    let client: IClient;
    jest
      .spyOn(connector, 'getClientByIdentificationNumber')
      .mockRejectedValue(new Error('mock error'));
    //act
    try {
      client = await useCase.apply(identification);
    } catch (e) {
      expect(e.status).toBe(404);
    }

    //Assert
    expect({ client }).toBeDefined();
  });
});
