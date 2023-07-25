import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';

import { GetCardsByAccountPartyUseCase } from '../get-cards-by-party.user-case';
import { CRMConnector } from '@dale/crm-connector-adapter/crm-connector';
import {
  cardResponseTest,
  partyId,
  mappedCardsTest,
  depositNumber,
} from '@dale/testcases/crm-testcases';

describe('GetCardsByAccountPartyUseCase', () => {
  let useCase: GetCardsByAccountPartyUseCase;
  let crmConnector: CRMConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCardsByAccountPartyUseCase,
        {
          provide: CRMConnector,
          useValue: {
            getCards: jest.fn().mockResolvedValue(cardResponseTest),
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

    useCase = module.get<GetCardsByAccountPartyUseCase>(
      GetCardsByAccountPartyUseCase,
    );
    crmConnector = module.get<CRMConnector>(CRMConnector);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(crmConnector).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('should return a mapped natural person', async () => {
    //Arrange

    //act
    const cards = await useCase.apply(partyId);

    //Assert
    expect(cards).toBeDefined();
    expect(cards).toEqual(mappedCardsTest);
  });

  it('should call the logger when error occurs', async () => {
    //Arrange
    let cards;
    jest
      .spyOn(crmConnector, 'getCards')
      .mockRejectedValue(new Error('mock error'));

    //act
    try {
      cards = await useCase.apply(depositNumber);
    } catch (e) {}

    //Assert
    expect(cards).toBeFalsy();
  });
});
