import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { FavoriteDbService } from './favorite.service';
import { DatabaseService } from '../connection/connection.service';
import {
  headers,
  mockQueryFavorite,
  mockUserFavorite,
  mockUserFavoriteCreate,
  mockUserFavoriteFailedDeleted,
  mockUserFavoriteQuery,
  mockUserFavoriteSuccessDeleted,
} from '../../../test/mock-data';
import { UUID_REGEX } from '@dale/shared-nestjs/constants/regex';
import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import { EventLogService } from '../../shared/event-log/event-log-service';
import { BadRequestExceptionDale } from '@dale/manage-errors-nestjs';

describe('favorite DB service', () => {
  let service;

  const mockSave = jest.fn(() => mockUserFavoriteCreate);
  const mockFind = jest.fn(() => [mockUserFavorite]);
  const mockFindOne = jest
    .fn()
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce([mockUserFavorite]);
  const mockQuery = jest.fn();
  const mockDelete = jest.fn();
  const response = {
    response: { code: 'IBT004' },
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteDbService,
        DatabaseService,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: mockSave,
              find: mockFind,
              findOne: mockFindOne,
              delete: mockDelete,
              query: mockQuery,
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
        {
          provide: EventLogService,
          useFactory: () => ({
            sendDebitTransferSQS: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<FavoriteDbService>(FavoriteDbService);
    service.onModuleInit();
  });
  describe('onModuleInit', () => {
    it('onModuleInit ok', async () => {
      service.onModuleInit();
      jest.advanceTimersByTime(60000);
    });
  });
  describe('the create favorite method', () => {
    afterEach(() => {
      mockSave.mockClear();
      mockFindOne.mockClear();
    });
    it('should create user favorite and return created user', async () => {
      const result = await service.createFavorite(
        mockUserFavoriteCreate.id,
        mockUserFavoriteCreate,
        headers,
      );
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledWith({
        userId: mockUserFavoriteCreate.userId,
        favoriteAlias: mockUserFavoriteCreate.favoriteAlias,
        phoneNumber: mockUserFavoriteCreate.phoneNumber,
        id: expect.stringMatching(UUID_REGEX),
      });
      expect(result).toEqual(mockUserFavoriteCreate);
    });
    it('should create user favorite and return user exist', async () => {
      const asyncMock = mockFindOne.mockResolvedValue(mockUserFavorite);
      await asyncMock();
      const result = await service.createFavorite(
        mockUserFavoriteCreate.id,
        mockUserFavoriteCreate,
        headers,
      );
      expect(mockFindOne).toHaveBeenCalledTimes(2);
      expect(mockFindOne).toHaveBeenCalledWith(mockUserFavoriteQuery);
      expect(result).toEqual(mockUserFavorite);
    });
    it('should create user favorite and return user Error', async () => {
      mockFindOne.mockImplementation(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.createFavorite(mockUserFavorite);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  describe('the findUserFavoriteById method', () => {
    afterEach(() => {
      mockQuery.mockClear();
    });
    it('should find and return the userFavorite', async () => {
      mockQuery.mockResolvedValue([mockUserFavorite]);
      const result = await service.findFavoriteByUserId(
        mockUserFavorite.userId,
        '',
        1,
        0,
      );
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(mockQueryFavorite);
      expect(result).toEqual([mockUserFavorite]);
    });
    it('should find and return the userFavorite Error', async () => {
      mockQuery.mockImplementation(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.findFavoriteByUserId(mockUserFavorite.userId, '', 1, 0);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  describe('the delete favorite method', () => {
    afterEach(() => {
      mockDelete.mockClear();
      mockFindOne.mockClear();
    });
    it('should delete userFavorite', async () => {
      const asyncMock = mockFindOne.mockResolvedValue(mockUserFavorite);
      await asyncMock();
      mockDelete.mockResolvedValue(mockUserFavoriteFailedDeleted);
      const result = await service.deleteFavoriteById(
        mockUserFavorite.id,
        mockUserFavorite.userId,
        headers,
      );
      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith(mockUserFavorite);
      expect(result).toEqual(mockUserFavoriteSuccessDeleted);
    });
    it('should delete userFavorite not exit', async () => {
      try {
        const asyncMock = mockFindOne.mockResolvedValue(null);
        await asyncMock();
        await service.deleteFavoriteById(
          mockUserFavorite.id,
          mockUserFavorite.userId,
          headers,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
    it('should delete userFavorite exit Error', async () => {
      mockDelete.mockImplementation(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.deleteFavoriteById(mockUserFavorite.id);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
});
