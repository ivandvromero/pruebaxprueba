import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { DatabaseService } from '../connection/connection.service';
import {
  AddUserDepositMock,
  mockDepositByUser,
  mockUser,
} from '../../../test/mock-data';
import { DepositDbService } from './deposit.service';
import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import { BadRequestExceptionDale } from '@dale/manage-errors-nestjs';
describe('user DB service', () => {
  let service: DepositDbService;
  let mockDatabaseService;
  const mockSave = jest.fn(() => Promise.resolve(mockUser));
  const mockFindOne = jest.fn(() => Promise.resolve(mockUser));
  const mockFind = jest.fn(() => Promise.resolve(mockDepositByUser));
  const mockUpdate = jest.fn(() => Promise.resolve(mockUser));
  const response = {
    response: { code: 'IBT004' },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositDbService,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: mockSave,
              findOne: mockFindOne,
              find: mockFind,
              update: mockUpdate,
              createQueryBuilder: jest.fn(() => ({
                innerJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([]),
              })),
            })),
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            error: jest.fn(),
            log: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get(DepositDbService);
    mockDatabaseService = module.get(DatabaseService);
    await service.onModuleInit();
  });
  describe('onModuleInit', () => {
    it('onModuleInit ok', async () => {
      await service.onModuleInit();
      jest.advanceTimersByTime(60000);
    });
  });
  describe('the findDepositByAccountNumber method', () => {
    it('should find and return the deposit by account number', async () => {
      const result = await service.findDepositByAccountNumber('test-id');
      expect(result).toEqual(mockUser);
    });
    it('should enter to catch', async () => {
      const depositRepository: any = {
        findOne: jest.fn(() => {
          throw new Error('test error');
        }),
      };
      jest
        .spyOn(mockDatabaseService, 'getRepository')
        .mockImplementation(() => depositRepository);
      try {
        await service.findDepositByAccountNumber('test-id');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('the findDepositByUserId method', () => {
    it('should find and return the deposit by user id', async () => {
      const result = await service.findDepositByUserId('test-id');
      expect(result).toEqual(['test-id']);
    });
    it('should find and return the deposit by user id catch', async () => {
      mockFind.mockImplementation(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.findDepositByUserId('test-id');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('the AddUserDeposit method', () => {
    afterEach(() => {
      mockSave.mockClear();
    });
    it('AddUserDeposit ok', async () => {
      const asyncMock = mockSave.mockResolvedValue(mockUser);
      await asyncMock();
      const result = await service.AddUserDeposit({
        user: AddUserDepositMock,
        accountNumber: 'test-id',
      });
      expect(result).toEqual(mockUser);
    });
    it('AddUserDeposit Error', async () => {
      mockSave.mockImplementation(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.AddUserDeposit({
          user: AddUserDepositMock,
          accountNumber: 'test-id',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
});
