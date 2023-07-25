import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';

import { GetDepositByDepositNumber } from '../get-deposits-by-deposit-number.use-case';
import { CRMConnector } from '@dale/crm-connector-adapter/crm-connector';
import {
  depositResponseTestByPartyNumber,
  depositNumber,
} from '@dale/testcases/crm-testcases';

describe('GetCardsByAccountPartyUseCase', () => {
  let useCase: GetDepositByDepositNumber;
  let crmConnector: CRMConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDepositByDepositNumber,
        {
          provide: CRMConnector,
          useValue: {
            getDeposits: jest
              .fn()
              .mockResolvedValue(depositResponseTestByPartyNumber),
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

    useCase = module.get<GetDepositByDepositNumber>(GetDepositByDepositNumber);
    crmConnector = module.get<CRMConnector>(CRMConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(crmConnector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should return a deposit', async () => {
    //Arrange

    //act
    const deposit = await useCase.apply(depositNumber);

    //Assert
    expect(deposit).toBeDefined();
    expect(deposit).toEqual(depositResponseTestByPartyNumber);
  });

  it('should call the logger when error occurs', async () => {
    //Arrange
    let cards;
    jest
      .spyOn(crmConnector, 'getDeposits')
      .mockRejectedValue(new Error('mock error'));

    //act
    try {
      cards = await useCase.apply(depositNumber);
    } catch (e) {}

    //Assert
    expect(cards).toBeFalsy();
  });
});
