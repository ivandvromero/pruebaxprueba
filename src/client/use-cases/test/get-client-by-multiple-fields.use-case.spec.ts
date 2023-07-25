import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CoreQueryConnector,
  ICoreQueryConnector,
} from '../../common/ports/core-query-connector.interface';
import { clientDto, mockAccount } from '@dale/testcases/client-testcases';
import { GetClientByMultipleFieldsUseCase } from '../get-client-by-multiple-fields.use-case';
import { IClient, IFilterCriteria } from '../../common/interfaces';
import { GetAccountByClientIdUseCase } from '../get-account-by-client-id.use-case';

describe('GetClientByEmailUseCase', () => {
  let useCase: GetClientByMultipleFieldsUseCase;
  let connector: ICoreQueryConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientByMultipleFieldsUseCase,
        {
          provide: CoreQueryConnector,
          useValue: {
            getClientByMultipleFields: jest.fn().mockResolvedValue(clientDto),
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

    useCase = module.get<GetClientByMultipleFieldsUseCase>(
      GetClientByMultipleFieldsUseCase,
    );
    connector = module.get<ICoreQueryConnector>(CoreQueryConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(connector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should return a client given an email and a phone number', async () => {
    //Arrange
    const fields: IFilterCriteria[] = [
      { field: 'emailAddress', value: 'mock@mail.com' },
      { field: 'mobilePhoneNumber', value: '3216545987' },
    ];

    //act
    const client = await useCase.apply(fields);

    //Assert
    expect(client).toBeDefined();
    expect(client.client).toBe(clientDto.client);
  });

  it('should call the logger when an error occur when given a email', async () => {
    //Arrange
    const fields: IFilterCriteria[] = [
      { field: 'emailAddress', value: 'mock@mail.com' },
      { field: 'mobilePhoneNumber', value: '3216545987' },
    ];
    let client: IClient;
    jest
      .spyOn(connector, 'getClientByMultipleFields')
      .mockRejectedValue(new Error('mock error'));
    //act
    try {
      client = await useCase.apply(fields);
    } catch (e) {
      expect(e.status).toBe(404);
    }

    //Assert
    expect(client).toBeFalsy();
    expect(logger.debug).toHaveBeenCalled();
  });
});
