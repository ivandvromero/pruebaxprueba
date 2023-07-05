import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteDbService } from '../../db/favorite/favorite.service';
import {
  headers,
  mockFavorite,
  mockUserFavorite,
  mockUserFavoriteSuccessDeleted,
} from '../../../test/mock-data';
import { UserFavoritesService } from './user-favorite.service';
import { UUID_REGEX } from '@dale/shared-nestjs/constants/regex';
import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import { BadRequestExceptionDale } from '@dale/manage-errors-nestjs';

const responseError = {
  response: { code: 'IBT004' },
};
describe('UserFavoritesService', () => {
  let service: UserFavoritesService;
  let userFavoriteDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFavoritesService,
        {
          provide: FavoriteDbService,
          useFactory: () => ({
            createFavorite: jest.fn(() => mockUserFavorite),
            findFavoriteByUserId: jest.fn(() => [mockUserFavorite]),
            deleteFavoriteById: jest.fn(() => mockUserFavoriteSuccessDeleted),
          }),
        },
      ],
    }).compile();

    service = module.get<UserFavoritesService>(UserFavoritesService);
    userFavoriteDbService = module.get<FavoriteDbService>(FavoriteDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // create
  describe('create favorite function', () => {
    afterEach(() => {
      userFavoriteDbService.createFavorite.mockClear();
    });

    it('should create favorite and return the created favorite', async () => {
      const result = await service.create(mockFavorite, headers);
      expect(userFavoriteDbService.createFavorite).toHaveBeenCalledTimes(1);
      expect(userFavoriteDbService.createFavorite).toHaveBeenCalledWith(
        expect.stringMatching(UUID_REGEX),
        mockFavorite,
        headers,
      );

      expect(result).toEqual(mockUserFavorite);
    });
    it('should create favorite and return the created favorite', async () => {
      userFavoriteDbService.createFavorite.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        await service.create(mockFavorite, headers);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  // findFavoriteById
  describe('find Favorite By user Id function', () => {
    afterEach(() => {
      userFavoriteDbService.findFavoriteByUserId.mockClear();
    });

    it('should find favorite and return favorite', async () => {
      const result = await service.findAllByUserId(
        mockUserFavorite.userId,
        '',
        1,
        0,
      );
      expect(userFavoriteDbService.findFavoriteByUserId).toHaveBeenCalledTimes(
        1,
      );
      expect(userFavoriteDbService.findFavoriteByUserId).toHaveBeenCalledWith(
        mockUserFavorite.userId,
        '',
        1,
        0,
      );

      expect(result).toEqual([mockUserFavorite]);
    });
    it('should find favorite and return favorite Error', async () => {
      userFavoriteDbService.findFavoriteByUserId.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        await service.findAllByUserId(mockUserFavorite.userId, '', 1, 0);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  // deleteFavoriteById
  describe('delete Favorite By Id function', () => {
    afterEach(() => {
      userFavoriteDbService.deleteFavoriteById.mockClear();
    });

    it('should delete favorite', async () => {
      const result = await service.remove(
        mockUserFavorite.id,
        mockUserFavorite.userId,
        headers,
      );
      expect(userFavoriteDbService.deleteFavoriteById).toHaveBeenCalledTimes(1);
      expect(userFavoriteDbService.deleteFavoriteById).toHaveBeenCalledWith(
        mockUserFavorite.id,
        mockUserFavorite.userId,
        headers,
      );

      expect(result).toEqual(mockUserFavoriteSuccessDeleted);
    });
    it('should delete favorite Error', async () => {
      userFavoriteDbService.deleteFavoriteById.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        await service.remove(
          mockUserFavorite.id,
          mockUserFavorite.userId,
          headers,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
});
