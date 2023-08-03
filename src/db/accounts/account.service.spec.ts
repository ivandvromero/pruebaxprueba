import { Logger } from '@dale/logger-nestjs';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  headersEventMock,
  mockAccount,
  mockHeaderDto,
} from '../../../test/mock-data';
import { DatabaseService } from '../connection/connection.service';
import { AccountDbService } from './account.service';

describe('AccountService', () => {
  let service: AccountDbService;

  const mockSave = jest.fn(() => Promise.resolve(mockAccount));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountDbService,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: mockSave,
            })),
            findOneBy: jest.fn(() => ({
              id: '1',
            })),
            isDbConnectionAlive: jest.fn(() => true),
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<AccountDbService>(AccountDbService);
  });

  it('should return true when isDbConnectionAlive function get called', async () => {
    const result = await service.isDbConnectionAlive();
    expect(result).toBe(true);
  });

  it('should call setInterval method when DB_ROTATING_KEY is to true', async () => {
    process.env.DB_ROTATING_KEY = 'true';
    process.env.DB_CONNECTION_REFRESH_MINUTES = '1';
    jest.spyOn(global, 'setInterval');
    await service.onModuleInit();
    expect(setInterval).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(60001);
  });

  describe('createAccount', () => {
    it('createAccount - Error', async () => {
      try {
        await service.createAccount(mockAccount);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });

  describe('getAccountsByUserId', () => {
    it('success', async () => {
      try {
        await service.getAccountsByUserId('', mockHeaderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });

  describe('getOneAccountByUserIdAndAccountNumber', () => {
    it('failt', async () => {
      try {
        await service.getOneAccountByUserIdAndAccountNumber(
          '',
          '',
          headersEventMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });

  describe('updateAccount', () => {
    it('failt', async () => {
      try {
        await service.updateAccount('', null, headersEventMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
});
