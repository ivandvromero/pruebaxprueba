import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  balanceResponseMapped,
  clientDto,
  clientDtoEnrollment,
  identification,
  transactionChanelsMock,
} from '../../../shared/testcases/client-testcases';
import { ClientService } from '../services/client.service';
import { ClientController } from './client.controller';
import { DynamodbModule } from '@dale/aws-nestjs';
import { LoggerModule } from '@dale/logger-nestjs';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';
import {
  naturalPersonMappedTest,
  mappedCardsTest,
  queryIdentification,
  partyId,
} from '@dale/testcases/crm-testcases';

describe('ClientController', () => {
  let controller: ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: {
            getClientHandler: jest
              .fn()
              .mockImplementation(() => Promise.resolve(clientDto)),
            getClientWithEnrollment: jest
              .fn()
              .mockImplementation(() => Promise.resolve(clientDtoEnrollment)),
            getTransactionChanels: jest
              .fn()
              .mockResolvedValue(transactionChanelsMock),
            getNaturalPerson: jest
              .fn()
              .mockResolvedValue(naturalPersonMappedTest),
            getNaturalPersonCards: jest.fn().mockResolvedValue(mappedCardsTest),
            getNaturalPersonBalance: jest
              .fn()
              .mockImplementation(() => Promise.resolve(balanceResponseMapped)),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
            reset: jest.fn(),
          },
        },
      ],
      imports: [
        DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
        LoggerModule.forRoot({ context: 'Client Module' }),
      ],
    }).compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get clients', () => {
    it('should return a client when searching by clientId', async () => {
      const searchArgument = { id: '987654321' };
      await expect(controller.getClient(searchArgument)).resolves.toEqual(
        clientDtoEnrollment.client,
      );
    });
    it('should return a client when searching by email', async () => {
      const searchArgument = { email: 'mock@mail.com' };
      await expect(controller.getClient(searchArgument)).resolves.toEqual(
        clientDtoEnrollment.client,
      );
    });
    it('should return a client when searching by phone number', async () => {
      const searchArgument = { phone: '3216545987' };
      await expect(controller.getClient(searchArgument)).resolves.toEqual(
        clientDtoEnrollment.client,
      );
    });
    it('should return a client when searching by email and phone number', async () => {
      const searchArgument = { email: 'mock@mail.com', phone: '3216545987' };
      await expect(controller.getClient(searchArgument)).resolves.toEqual(
        clientDtoEnrollment.client,
      );
    });
  });
  describe('get transaction chanels', () => {
    it('should return the transaction channels', async () => {
      await expect(controller.getTransactionCodes()).resolves.toEqual(
        transactionChanelsMock,
      );
    });
  });
  describe('get natural person', () => {
    it('should return a natural person when searching by any param', async () => {
      await expect(
        controller.getNaturalPerson(queryIdentification),
      ).resolves.toEqual(naturalPersonMappedTest);
    });
  });
  describe('get cards', () => {
    it('should return an array of mapped cards when searching by partyId ', async () => {
      await expect(controller.getNaturalPersonCards(partyId)).resolves.toEqual(
        mappedCardsTest,
      );
    });
  });
  describe('get client balance', () => {
    it('should return the client balance', async () => {
      await expect(
        controller.getNaturalPersonBalance(identification),
      ).resolves.toEqual(balanceResponseMapped);
    });
  });
});
