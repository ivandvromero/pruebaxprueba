import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosAdapter } from '../http-adapters/axios-adapter';
import { CRMConnector } from './crm-connector';
import {
  contactResponseByParamTest,
  identificationSearch,
  cardResponseTest,
  partyId,
  depositResponseTestByPartyNumber,
} from '@dale/testcases/crm-testcases';

describe('CRMConnector', () => {
  let crmConnector: CRMConnector;
  let configService: ConfigService;
  let http: AxiosAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CRMConnector,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'apiConfigCRM'),
          },
        },
        {
          provide: AxiosAdapter,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    crmConnector = module.get<CRMConnector>(CRMConnector);
    configService = module.get<ConfigService>(ConfigService);
    http = module.get<AxiosAdapter>(AxiosAdapter);
  });

  it('should be defined', () => {
    expect(CRMConnector).toBeDefined();
    expect(configService).toBeDefined();
    expect(http).toBeDefined();
  });

  describe('get contact', () => {
    it('should return an array of contacts when searching by deposit number', async () => {
      http.get = jest.fn().mockImplementation(() => contactResponseByParamTest);
      await expect(
        crmConnector.getNaturalPersonByParams(identificationSearch),
      ).resolves.toEqual(contactResponseByParamTest);
    });
  });
  describe('get cards', () => {
    it('should return a card', async () => {
      http.get = jest.fn().mockImplementation(() => cardResponseTest);
      await expect(crmConnector.getCards(partyId)).resolves.toEqual(
        cardResponseTest,
      );
    });
  });

  describe('get deposits', () => {
    it('should return a deposit', async () => {
      http.get = jest
        .fn()
        .mockImplementation(() => depositResponseTestByPartyNumber);
      await expect(crmConnector.getDeposits(partyId)).resolves.toEqual(
        depositResponseTestByPartyNumber,
      );
    });
  });
});
