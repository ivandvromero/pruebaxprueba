import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { UserDbService } from './user.service';
import { DatabaseService } from '../connection/connection.service';
import {
  mockTestUserRegistered,
  mockUser,
  mockUserDob,
  mockUserResponseUpdateLocate,
  mockUserUpdateLocate,
} from '../../../test/mock-data';
import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import {
  BadRequestExceptionDale,
  InternalServerExceptionDale,
  NotFoundExceptionDale,
} from '@dale/manage-errors-nestjs';

describe('user DB service', () => {
  let service: UserDbService;
  const mockSave = jest.fn(() => Promise.resolve(mockUser));
  const mockFindOne = jest.fn(() => Promise.resolve(mockUser));
  const mockUpdate = jest.fn(() => Promise.resolve(mockUser));
  const mockUpdateLocate = jest.fn(() =>
    Promise.resolve(mockUserResponseUpdateLocate),
  );
  const mockisDbConnectionAlive = jest.fn(() => Promise.resolve(true));

  const response = {
    response: { code: 'IBT004' },
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDbService,
        DatabaseService,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            isDbConnectionAlive: mockisDbConnectionAlive,
            getRepository: jest.fn(() => ({
              save: mockSave,
              findOne: mockFindOne,
              update: mockUpdate,
              updateLocate: mockUpdateLocate,
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
    service = module.get<UserDbService>(UserDbService);
    await service.onModuleInit();
  });
  describe('the create method', () => {
    afterEach(() => {
      mockSave.mockClear();
    });
    it('should create user and return created user', async () => {
      const result = await service.createUser(mockTestUserRegistered);
      expect(result).toEqual(mockUser);
    });
    it('should create user and return created user error', async () => {
      mockSave.mockImplementationOnce(() =>
        Promise.reject(
          new InternalServerExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.createUser(mockTestUserRegistered);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('the findUserById method', () => {
    afterEach(() => {
      mockFindOne.mockClear();
    });
    it('should find and return the user', async () => {
      const result = await service.findUserById('test-id');

      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
      expect(result).toEqual(mockUser);
    });
    it('should find and return the user error', async () => {
      mockFindOne.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.findUserById('test-id');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('the update user by email method', () => {
    afterEach(() => {
      mockUpdate.mockClear();
    });
    it('should update the user details', async () => {
      const result = await service.updateUserByEmail('test-email', {
        firstName: 'test-name',
      });

      expect(mockUpdate).toHaveBeenCalledWith(
        { email: 'test-email' },
        { firstName: 'test-name' },
      );
      expect(result).toEqual(mockUser);
    });
    it('should update the user details error', async () => {
      mockUpdate.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.updateUserByEmail('test-email', {
          firstName: 'test-name',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('the update user by id method', () => {
    afterEach(() => {
      mockUpdate.mockClear();
    });
    it('should update the user details', async () => {
      const result = await service.updateUserById('test-id', {
        firstName: 'test-name',
      });

      expect(mockUpdate).toHaveBeenCalledWith(
        { id: 'test-id' },
        { firstName: 'test-name' },
      );
      expect(result).toEqual(mockUser);
    });
    it('should update the user details Error', async () => {
      mockUpdate.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.updateUserById('test-id', {
          firstName: 'test-name',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('the find user method', () => {
    afterEach(() => {
      mockFindOne.mockClear();
    });
    it('should fetch the user entry for the given email address', async () => {
      const result = await service.findUserByEmail(mockUser.email);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });

      expect(result).toEqual(mockUser);
    });
    it('should fetch the user entry for the given email address dob', async () => {
      const asyncMock = mockFindOne.mockResolvedValue(mockUserDob);
      await asyncMock();
      const result = await service.findUserByEmail(mockUser.email);

      expect(mockFindOne).toHaveBeenCalledTimes(2);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });

      expect(result).toEqual(mockUserDob);
    });
    it('should fetch the user entry for the given email address error ', async () => {
      mockFindOne.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.findUserByEmail(mockUser.email);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('findUserByPhoneNumber', () => {
    afterEach(() => {
      mockFindOne.mockClear();
    });
    it('findUserByPhoneNumber', async () => {
      const asyncMock = mockFindOne.mockResolvedValue(mockUser);
      await asyncMock();
      const result = await service.findUserByPhoneNumber('3000000000');
      expect(result).toEqual(mockUser);
    });
    it('findUserByPhoneNumber Error', async () => {
      mockFindOne.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.findUserByPhoneNumber('1000000000');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('findUserByDocumentNumber', () => {
    afterEach(() => {
      mockFindOne.mockClear();
    });
    it('findUserByPhoneNumber', async () => {
      const result = await service.findUserByDocumentNumber('1000000000');
      expect(result).toEqual(mockUser);
    });
    it('findUserByPhoneNumber Error', async () => {
      mockFindOne.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, response),
        ),
      );
      try {
        await service.findUserByDocumentNumber('1000000000');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('isDbConnectionAlive', () => {
    afterEach(() => {
      mockisDbConnectionAlive.mockClear();
    });
    it('isDbConnectionAlive succesfull', async () => {
      const asyncMock = mockisDbConnectionAlive.mockResolvedValue(true);
      await asyncMock();
      const result = await service.isDbConnectionAlive();
      expect(result).toEqual(true);
    });
  });
  describe('onModuleInit', () => {
    it('onModuleInit ok', async () => {
      await service.onModuleInit();
      jest.advanceTimersByTime(60000);
    });
  });
  describe('the update locate by phoneNumber method', () => {
    afterEach(() => {
      mockUpdateLocate.mockClear();
    });
    it('should update locate city and departament ', async () => {
      const result = await service.updateCityAndDepartamentByPhoneNumber(
        mockUserUpdateLocate.phoneNumber,
        mockUserUpdateLocate.updateLocation,
      );
      expect(result.message).toEqual(mockUserResponseUpdateLocate.data);
    });
    it('should update the user details Error', async () => {
      mockUpdateLocate.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS019, response),
        ),
      );
      try {
        await service.updateCityAndDepartamentByPhoneNumber(
          mockUserUpdateLocate.phoneNumber,
          mockUserUpdateLocate.updateLocation,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('check if the user needs to update location', () => {
    it('I dont need to update the location', async () => {
      const result = await service.locationRequired('test-email');
      expect(result).toEqual(false);
    });
    it('should verify location data Error', async () => {
      jest.spyOn(service, 'findUserById').mockImplementation(() => {
        return null;
      });
      try {
        await service.locationRequired('das');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundExceptionDale);
      }
    });
    it('should unhandled error', async () => {
      jest.spyOn(service, 'findUserById').mockImplementation(() => {
        throw new Error('');
      });
      try {
        await service.locationRequired('das');
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
});
