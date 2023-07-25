import { Test, TestingModule } from '@nestjs/testing';
import {
  balanceResponse,
  balanceResponseMapped,
  clientDto,
  clientDtoEnrollment,
  identification,
  transactionChanelsMock,
} from '../../../shared/testcases/client-testcases';
import { ClientService } from './client.service';
import {
  GetClientByIdUseCase,
  GetClientByMultipleFieldsUseCase,
  GetTransactionChanelsUseCase,
  GetClientByDepositNumberUseCase,
  GetAccountByIdentificationNumberUseCase,
} from '../../use-cases';

import { GetClientEnrollmentUseCase } from '@dale/client/use-cases/crm/get-client-enrollment.use-case';
import {
  GetNaturalPersonUseCaseByParams,
  GetCardsByAccountPartyUseCase,
  GetDepositByDepositNumber,
} from '@dale/client/use-cases/crm';
import {
  naturalPersonMappedTest,
  mappedCardsTest,
  depositResponseTestByPartyNumber,
  queryIdentification,
  queryPhoneNumber,
  queryDepositNumber,
  partyId,
} from '@dale/testcases/crm-testcases';

describe('ClientService', () => {
  let service: ClientService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: GetClientByIdUseCase,
          useValue: {
            apply: jest
              .fn()
              .mockImplementation(() => Promise.resolve(clientDto)),
          },
        },
        {
          provide: GetClientByMultipleFieldsUseCase,
          useValue: {
            apply: jest
              .fn()
              .mockImplementation(() => Promise.resolve(clientDto)),
          },
        },
        {
          provide: GetTransactionChanelsUseCase,
          useValue: {
            apply: jest.fn().mockResolvedValue(transactionChanelsMock),
          },
        },
        {
          provide: GetClientByDepositNumberUseCase,
          useValue: {
            apply: jest.fn().mockResolvedValue(clientDto),
          },
        },
        {
          provide: GetNaturalPersonUseCaseByParams,
          useValue: {
            apply: jest.fn().mockResolvedValue(naturalPersonMappedTest),
          },
        },
        {
          provide: GetCardsByAccountPartyUseCase,
          useValue: {
            apply: jest.fn().mockResolvedValue(mappedCardsTest),
          },
        },
        {
          provide: GetDepositByDepositNumber,
          useValue: {
            apply: jest
              .fn()
              .mockResolvedValue(depositResponseTestByPartyNumber),
          },
        },
        {
          provide: GetAccountByIdentificationNumberUseCase,
          useValue: {
            apply: jest.fn().mockResolvedValue(balanceResponse),
          },
        },
        {
          provide: GetClientEnrollmentUseCase,
          useValue: {
            apply: jest.fn().mockResolvedValue('simplificado'),
          },
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get clients', () => {
    it('should return a client when searching by clientId', async () => {
      const searchArgument = { id: '987654321' };
      await expect(service.getClientHandler(searchArgument)).resolves.toEqual(
        clientDto,
      );
    });
    it('should return a client when searching by email', async () => {
      const searchArgument = { email: 'mock@mail.com' };
      await expect(service.getClientHandler(searchArgument)).resolves.toEqual(
        clientDto,
      );
    });
    it('should return a client when searching by phone number', async () => {
      const searchArgument = { phone: '3216545987' };
      await expect(service.getClientHandler(searchArgument)).resolves.toEqual(
        clientDto,
      );
    });
    it('should return a client when searching by email and phone number', async () => {
      const searchArgument = { email: 'mock@mail.com', phone: '3216545987' };
      await expect(service.getClientHandler(searchArgument)).resolves.toEqual(
        clientDto,
      );
    });
    it('should return a client when searching by deposit  number', async () => {
      const searchArgument = { depositNumber: '3216545987' };
      await expect(service.getClientHandler(searchArgument)).resolves.toEqual(
        clientDto,
      );
    });
    it('should return a client when searching by identification  number', async () => {
      const searchArgument = { depositNumber: '123456789' };
      await expect(service.getClientHandler(searchArgument)).resolves.toEqual(
        clientDto,
      );
    });
  });

  describe('get client with enrollment', () => {
    it('get client with enrollment', async () => {
      const searchArgument = { depositNumber: '123456789' };
      await expect(
        service.getClientWithEnrollment(searchArgument),
      ).resolves.toEqual(clientDtoEnrollment);
    });
  });

  describe('get transaction chanels', () => {
    it('should the transaction chanels', async () => {
      await expect(service.getTransactionChanels()).resolves.toEqual({
        transactionChannel: transactionChanelsMock,
      });
    });
  });
  describe('get natural person', () => {
    it('should return a natural person when searching by identification ', async () => {
      await expect(
        service.getNaturalPerson(queryIdentification),
      ).resolves.toEqual(naturalPersonMappedTest);
    });

    it('should return a natural person when searching by identification ', async () => {
      await expect(service.getNaturalPerson(queryPhoneNumber)).resolves.toEqual(
        naturalPersonMappedTest,
      );
    });

    it('should return a natural person when searching by identification ', async () => {
      await expect(
        service.getNaturalPerson(queryDepositNumber),
      ).resolves.toEqual(naturalPersonMappedTest);
    });
  });

  describe('get cards', () => {
    it('should return an array of mapped cards when searching by partyId ', async () => {
      await expect(service.getNaturalPersonCards(partyId)).resolves.toEqual(
        mappedCardsTest,
      );
    });
  });
  describe('get balance', () => {
    it('should return aan object with the balance ', async () => {
      await expect(
        service.getNaturalPersonBalance(identification),
      ).resolves.toEqual(balanceResponseMapped);
    });
  });
});
