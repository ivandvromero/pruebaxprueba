import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { UserFavoriteController } from './user-favorite.controller';
import { UserFavoritesService } from './user-favorite.service';
import { createResponse, MockResponse } from 'node-mocks-http';
import { Response } from 'express';
import {
  headers,
  mockFavorite,
  mockUserFavorite,
  mockUserFavoriteSuccessDeleted,
} from '../../../test/mock-data';
import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import { BadRequestExceptionDale } from '@dale/manage-errors-nestjs';

let response: MockResponse<Response>;
describe('UserFavoriteController', () => {
  let controller: UserFavoriteController;
  let spyUserFavoriteService;
  const responseError = {
    response: { code: 'IBT004' },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFavoriteController],
      providers: [
        {
          provide: UserFavoritesService,
          useFactory: () => ({
            create: jest.fn(() => mockUserFavorite),
            findAllByUserId: jest.fn(() => [mockUserFavorite]),
            remove: jest.fn(() => mockUserFavoriteSuccessDeleted),
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

    controller = module.get<UserFavoriteController>(UserFavoriteController);
    spyUserFavoriteService =
      module.get<UserFavoritesService>(UserFavoritesService);
    response = createResponse();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(spyUserFavoriteService).toBeDefined();
    expect(response).toBeDefined();
  });

  describe('create favorite', () => {
    it('should return http 200 and message Successfully', async () => {
      const result = await controller.create(mockFavorite, headers);
      expect(spyUserFavoriteService.create).toHaveBeenCalledTimes(1);
      expect(spyUserFavoriteService.create).toHaveBeenCalledWith(
        mockFavorite,
        headers,
      );
      expect(result).toEqual(mockUserFavorite);
    });
    it('should return http 400 and message Error', async () => {
      spyUserFavoriteService.create.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        await controller.create(mockFavorite, null);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  // find by id
  describe('find favorite by id', () => {
    it('should return http 200 and favorite object', async () => {
      const request = {
        userId: '882744c6-6cf2-4de3-aacd-22d69310240d',
      };
      const result = await controller.findAllById(
        request.userId,
        '',
        1,
        0,
        null,
      );
      expect(result).toEqual([mockUserFavorite]);
    });
    it('should return http 400 and favorite object', async () => {
      spyUserFavoriteService.findAllByUserId.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        const request = {
          userId: '882744c6-6cf2-4de3-aacd-22d69310240d',
        };
        await controller.findAllById(request.userId, '', 1, 0, null);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  //remove
  describe('remove favorite', () => {
    it('should return http 200 and message Successfully', async () => {
      const request = {
        favoriteId: '5e063e90-4c31-410a-b239-a46272685d48',
        userId: '5e063e90-4c31-410a-b239-a46272685d48',
      };
      const result = await controller.remove(
        request.favoriteId,
        request.userId,
        null,
      );
      expect(result).toEqual(mockUserFavoriteSuccessDeleted);
    });
    it('should return http 400 and message Error', async () => {
      spyUserFavoriteService.remove.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        const request = {
          favoriteId: '5e063e90-4c31-410a-b239-a46272685d48',
          userId: '5e063e90-4c31-410a-b239-a46272685d48',
        };
        await controller.remove(request.favoriteId, request.userId, null);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
    it('should return http 400 and message not error Response', async () => {
      spyUserFavoriteService.remove.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(null, {
            response: { message: 'IBT004' },
          }),
        ),
      );
      try {
        const request = {
          favoriteId: '5e063e90-4c31-410a-b239-a46272685d48',
          userId: '5e063e90-4c31-410a-b239-a46272685d48',
        };
        await controller.remove(request.favoriteId, request.userId, null);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
});
