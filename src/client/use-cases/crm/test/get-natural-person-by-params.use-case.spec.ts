import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { GetNaturalPersonUseCaseByParams } from '../get-natural-person-by-params.use-case';
import { MambuService } from '@dale/client/modules/services/mambu.service';
import {
  contactResponseByParamTest,
  emptyCardResponseTest,
  emptyDepositResponseTestByPartyNumber,
  depositNumber,
  naturalPersonSearchedByParamMappedTestWithoutCardAndDeposit,
  cardResponseTest,
  depositResponseTestByPartyNumber,
  naturalPersonMappedTest,
} from '@dale/testcases/crm-testcases';
import { CRMConnector } from '@dale/crm-connector-adapter/crm-connector';

describe('GetNaturalPersonUseCaseByAccountParty', () => {
  let useCase: GetNaturalPersonUseCaseByParams;
  let mambuService: MambuService;
  let crmConnector: CRMConnector;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetNaturalPersonUseCaseByParams,
        {
          provide: CRMConnector,
          useValue: {
            getNaturalPersonByParams: jest
              .fn()
              .mockResolvedValue(contactResponseByParamTest),
            getCards: jest.fn(),
            getDeposits: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
          },
        },
        {
          provide: MambuService,
          useValue: {
            getTransactionsCount: jest.fn().mockResolvedValue('10'),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetNaturalPersonUseCaseByParams>(
      GetNaturalPersonUseCaseByParams,
    );
    crmConnector = module.get<CRMConnector>(CRMConnector);
    logger = module.get<Logger>(Logger);
    mambuService = module.get<MambuService>(MambuService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(crmConnector).toBeDefined();
    expect(logger).toBeDefined();
    expect(mambuService).toBeDefined();
  });

  it('should return a mapped natural person', async () => {
    //Arrange

    jest
      .spyOn(crmConnector, 'getCards')
      .mockResolvedValue(emptyCardResponseTest);

    jest
      .spyOn(crmConnector, 'getDeposits')
      .mockResolvedValue(emptyDepositResponseTestByPartyNumber);
    //act
    const naturalPerson = await useCase.apply(depositNumber);

    //Assert
    expect(naturalPerson).toBeDefined();
    expect(naturalPerson).toEqual(
      naturalPersonSearchedByParamMappedTestWithoutCardAndDeposit,
    );
  });

  it('should return a mapped natural person', async () => {
    //Arrange

    const cardsSpy = jest
      .spyOn(crmConnector, 'getCards')
      .mockResolvedValue(cardResponseTest);

    const depositsSpy = jest
      .spyOn(crmConnector, 'getDeposits')
      .mockResolvedValue(depositResponseTestByPartyNumber);
    //act
    const naturalPerson = await useCase.apply(depositNumber);

    //Assert
    expect(cardsSpy).toBeDefined();
    expect(depositsSpy).toBeDefined();
    expect(naturalPerson).toBeDefined();
    expect(naturalPerson).toEqual(naturalPersonMappedTest);
  });

  it('should call the logger when error occurs', async () => {
    //Arrange
    let naturalPerson;
    jest
      .spyOn(crmConnector, 'getNaturalPersonByParams')
      .mockRejectedValue(new Error('mock error'));
    //act
    try {
      naturalPerson = await useCase.apply(depositNumber);
    } catch (e) {}

    //Assert
    expect(naturalPerson).toBeFalsy();
  });
});
