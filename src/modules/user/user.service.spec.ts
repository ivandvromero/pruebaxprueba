import { UserDbService } from '../../db/user/user.service';
import { UserService } from '../../modules/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockUser,
  mockTestUserRegistered,
  mockUpdateUser,
  mockUserResponse,
  mockDepositResponse,
  enrollmentNpDataResponse,
  updateUserEventRequest,
  mockCreateuserRequest,
  headers,
  mockHeadersEvent,
  mockUserResponseUpdateLocate,
  mockUserUpdateLocate,
} from '../../../test/mock-data';
import { DepositDbService } from '../../db/deposit/deposit.service';
import { DatabaseService } from '../../db/connection/connection.service';
import { EnrollmentService } from '../../providers/dale/services/enrollment.service';
import { of } from 'rxjs';
import { Logger } from '@dale/logger-nestjs';
import { ErrorCodesEnum } from 'src/shared/code-erros/error-codes.enum';
import {
  BadRequestExceptionDale,
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { SqsLogsService } from '../../providers/sqs-logs/sqs-logs.service';
import { RequirementsUserResponseData } from './dto/requirements-user.dto';

describe('user service', () => {
  let service: UserService;
  let userDbService;
  let depositDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DepositDbService,
          useFactory: () => ({
            findDepositByAccountNumber: jest.fn(() =>
              Promise.resolve(mockDepositResponse),
            ),
            findDepositByUserId: jest.fn(() =>
              Promise.resolve(['000000123780']),
            ),
            AddUserDeposit: jest.fn(() => null),
          }),
        },
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
          }),
        },
        DatabaseService,
        {
          provide: UserDbService,
          useFactory: () => ({
            // createUser: jest.fn(() => Promise.resolve(mockTestUserRegistered)),
            findUserById: jest.fn(() =>
              Promise.resolve(mockTestUserRegistered),
            ),
            findUserByEmail: jest.fn(() => Promise.resolve(mockUserResponse)),
            updateUserByEmail: jest.fn(() => Promise.resolve({ affected: 1 })),
            updateUserById: jest.fn(() => Promise.resolve({ affected: 1 })),
            findUserByPhoneNumber: jest.fn(() =>
              Promise.resolve(mockUserResponse),
            ),
            updateCityAndDepartamentByPhoneNumber: jest.fn(() =>
              Promise.resolve(mockUserResponseUpdateLocate),
            ),
            locationRequired: jest.fn(),
            findUserByDocumentNumber: jest.fn(() =>
              Promise.resolve(mockUserResponse),
            ),
            createUser: jest.fn(() => Promise.resolve(mockTestUserRegistered)),
          }),
        },
        {
          provide: EnrollmentService,
          useFactory: () => ({
            getUserInfoByEnrollmentId: jest.fn(() =>
              Promise.resolve(enrollmentNpDataResponse),
            ),
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
        {
          provide: SqsLogsService,
          useFactory: () => ({
            sendMessageLog: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userDbService = module.get(UserDbService);
    depositDbService = module.get(DepositDbService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateUserEvent function', () => {
    const mockHeaders = {
      ipAddress: '127.0.0.1',
      transactionId: '6cc33a67-4d14-4669-961a-817496971d8f',
      channelId: 'POSTMAN',
      timestamp: '2023-02-03T16:23:57.514',
      'user-agent': 'PostmanRuntime/7.31.3',
    };
    it('Success', async () => {
      const result = await service.updateUserEvent(
        updateUserEventRequest,
        mockHeaders,
      );
      expect(result).toEqual(true);
    });
    it('catch Error', async () => {
      userDbService.findUserByPhoneNumber.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS001, {
            response: { code: '0000' },
          }),
        ),
      );
      try {
        await service.updateUserEvent(updateUserEventRequest, mockHeaders);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });

    it('catch Custom Error', async () => {
      userDbService.findUserByPhoneNumber.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS001, {
            response: { code: '0000' },
          }),
        ),
      );
      try {
        await service.updateUserEvent(updateUserEventRequest, mockHeaders);
      } catch (err) {
        expect(err).toBeInstanceOf(CustomException);
      }
    });
  });

  describe('findUserById function', () => {
    afterEach(() => {
      userDbService.findUserById.mockClear();
    });

    it('should find and return the user', async () => {
      const result = await service.findUserById('test-id');
      expect(userDbService.findUserById).toHaveBeenCalledTimes(1);
      expect(userDbService.findUserById).toHaveBeenCalledWith('test-id');

      expect(result).toEqual(mockTestUserRegistered);
    });
    it('should throw an error if the user does not exist', async () => {
      userDbService.findUserById.mockImplementationOnce(() =>
        Promise.resolve(null),
      );
      try {
        await service.findUserById('wrong-id');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  describe('findUser function', () => {
    afterEach(() => {
      userDbService.findUserByEmail.mockClear();
      userDbService.findUserByPhoneNumber.mockClear();
      userDbService.findUserByDocumentNumber.mockClear();
      depositDbService.findDepositByAccountNumber.mockClear();
    });

    it('should find user by document number and return the user', async () => {
      const result = await service.findUser(
        '123456',
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(userDbService.findUserByDocumentNumber).toHaveBeenCalledTimes(1);
      expect(userDbService.findUserByDocumentNumber).toHaveBeenCalledWith(
        '123456',
      );
      expect(result).toEqual(mockUserResponse);
    });
    it('should find user by phone number and return the user', async () => {
      const result = await service.findUser(
        undefined,
        'mock',
        undefined,
        undefined,
        undefined,
      );
      expect(userDbService.findUserByPhoneNumber).toHaveBeenCalledTimes(1);
      expect(userDbService.findUserByPhoneNumber).toHaveBeenCalledWith('mock');
      expect(result).toEqual(mockUserResponse);
    });
    it('should find user by account number and return the user', async () => {
      const result = await service.findUser(
        undefined,
        undefined,
        '123456',
        undefined,
        undefined,
      );
      expect(depositDbService.findDepositByAccountNumber).toHaveBeenCalledTimes(
        1,
      );
      expect(depositDbService.findDepositByAccountNumber).toHaveBeenCalledWith(
        '123456',
      );
      expect(result).toEqual(mockUserResponse);
    });
    it('should find user by email and return the user', async () => {
      const result = await service.findUser(
        undefined,
        undefined,
        undefined,
        'test@email',
        undefined,
      );
      expect(userDbService.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(userDbService.findUserByEmail).toHaveBeenCalledWith('test@email');
      expect(result).toEqual(mockUserResponse);
    });
    it('should find user by email and return the user', async () => {
      const result = await service.findUser(
        undefined,
        undefined,
        undefined,
        undefined,
        'user',
      );
      expect(userDbService.findUserById).toHaveBeenCalledTimes(1);
      expect(userDbService.findUserById).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockTestUserRegistered);
    });
    it('should return an error message if the user not exist (document)', async () => {
      userDbService.findUserByDocumentNumber.mockImplementationOnce(() =>
        Promise.resolve(null),
      );
      const result = await service.findUser(
        'mocker-error-data',
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual({ error: 'MUS006' });
    });
    it('should return an error message if the user not exist (phone)', async () => {
      userDbService.findUserByPhoneNumber.mockImplementationOnce(() =>
        Promise.resolve(null),
      );
      const result = await service.findUser(
        undefined,
        'mocker-error-data',
        undefined,
        undefined,
        undefined,
      );
      expect(result).toEqual({ error: 'MUS004' });
    });
    it('should return an error message if the user not exist (account)', async () => {
      depositDbService.findDepositByAccountNumber.mockImplementationOnce(() =>
        Promise.resolve(null),
      );
      const result = await service.findUser(
        undefined,
        undefined,
        'mocker-error-data',
        undefined,
        undefined,
      );
      expect(result).toEqual({ error: 'MUS003' });
    });
    it('should return an error message if the user not exist (email)', async () => {
      userDbService.findUserByEmail.mockImplementationOnce(() =>
        Promise.resolve(null),
      );
      const result = await service.findUser(
        undefined,
        undefined,
        undefined,
        'mocker-error-data',
        undefined,
      );
      expect(result).toEqual({ error: 'MUS007' });
    });
    it('should return an error message if the user not exist (id)', async () => {
      userDbService.findUserById.mockImplementationOnce(() =>
        Promise.resolve(null),
      );
      const result = await service.findUser(
        undefined,
        undefined,
        undefined,
        undefined,
        'mocker-error-data',
      );
      expect(result).toEqual({ error: 'MUS009' });
    });
    it('should throw an error if has no search parameters', async () => {
      try {
        await service.findUser(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  describe('updateUserByEmail function', () => {
    afterEach(() => {
      userDbService.updateUserByEmail.mockClear();
    });

    it('should update the user', async () => {
      await service.updateUserByEmail(mockUpdateUser.email, {
        firstName: mockUpdateUser.firstName,
      });
      expect(userDbService.updateUserByEmail).toHaveBeenCalledTimes(1);
      expect(userDbService.updateUserByEmail).toHaveBeenCalledWith(
        mockUpdateUser.email,
        {
          firstName: mockUpdateUser.firstName,
        },
      );
    });

    it('should throw an error if the user update fails in db due to user not existing', async () => {
      userDbService.updateUserByEmail.mockImplementationOnce(() =>
        Promise.resolve({ raw: {}, affected: 0, generatedMaps: [] }),
      );
      try {
        await service.updateUserByEmail(mockUpdateUser.email, {
          firstName: mockUpdateUser.firstName,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  describe('updateUserById function', () => {
    afterEach(() => {
      userDbService.updateUserById.mockClear();
    });

    it('should update the user', async () => {
      await service.updateUserById('test-id', {
        firstName: 'test-name',
      });
      expect(userDbService.updateUserById).toHaveBeenCalledTimes(1);
      expect(userDbService.updateUserById).toHaveBeenCalledWith('test-id', {
        firstName: 'test-name',
      });
    });

    it('should throw an error if the user update fails in db due to user not existing', async () => {
      userDbService.updateUserById.mockImplementationOnce(() =>
        Promise.resolve({ raw: {}, affected: 0, generatedMaps: [] }),
      );
      try {
        await service.updateUserById(mockUser.id, {
          firstName: mockUpdateUser.firstName,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  describe('validateUserExist', () => {
    it('Validate account number exist', async () => {
      await service.validateUserExist('0000002740', '').then((result) => {
        expect(result).toEqual({
          phoneNumber: result?.phoneNumber,
          accountsNumber: result?.accountsNumber,
        });
      });
    });

    it('Validate account number not exist', async () => {
      depositDbService.findDepositByAccountNumber.mockImplementation(() =>
        Promise.resolve(null),
      );

      try {
        await service.validateUserExist('0000002740', '');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestExceptionDale);
      }
    });

    it('Validate phone number number exist', async () => {
      userDbService.findUserByPhoneNumber.mockImplementation(() =>
        Promise.resolve({ id: 'test-id' }),
      );
      await service.validateUserExist(null, '0000002740').then((result) => {
        expect(result).toEqual({
          phoneNumber: result?.phoneNumber,
          accountsNumber: ['000000123780'],
        });
      });
    });

    it('Validate phone number number not exist', async () => {
      userDbService.findUserByPhoneNumber.mockImplementation(() =>
        Promise.resolve(null),
      );

      try {
        await service.validateUserExist(null, '0000002740');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  describe('createUser function', () => {
    it('Success', async () => {
      const result = await service.createUser(mockCreateuserRequest, headers);
      expect(result.data.username).toEqual(mockCreateuserRequest.username);
    });
    it('catch Error', async () => {
      userDbService.createUser.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS001, {
            response: { code: '0000' },
          }),
        ),
      );
      try {
        await service.createUser(mockCreateuserRequest, headers);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });

    it('catch Custom Error', async () => {
      userDbService.createUser.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS001, {
            response: { code: '0000' },
          }),
        ),
      );
      try {
        await service.createUser(mockCreateuserRequest, headers);
      } catch (err) {
        expect(err).toBeInstanceOf(CustomException);
      }
    });
  });
  describe('AddUserDeposit', () => {
    it('Success', async () => {
      const res = await service.AddUserDeposit({
        accountNumber: '',
        userId: '',
        trackingId: '',
      });
      expect(res).toBeUndefined();
    });
  });

  describe('kafkaQueueRetry', () => {
    it('success', async () => {
      await service.kafkaQueueRetry(
        '',
        3,
        {
          value: {},
          headers: mockHeadersEvent,
        },
        '',
      );
    });

    it('max Attempts', async () => {
      const headers = mockHeadersEvent;
      headers.attempts = '6';
      await service.kafkaQueueRetry(
        '',
        3,
        {
          value: {},
          headers: headers,
        },
        '',
      );
    });
  });

  describe('insertEnrollmentQueueStepData', () => {
    it('success', async () => {
      await service.insertEnrollmentQueueStepData(
        { actions: [], data: {}, enrollmentId: '', step: '' },
        mockHeadersEvent,
      );
    });
  });

  describe('update location by phoneNumber', () => {
    afterEach(() => {
      userDbService.updateCityAndDepartamentByPhoneNumber.mockClear();
    });

    it('should update the user ', async () => {
      try {
        await service.updateCityAndDepartamentByPhoneNumber(
          mockUserUpdateLocate.phoneNumber,
          mockUserUpdateLocate.updateLocation,
        );
        expect(
          userDbService.updateCityAndDepartamentByPhoneNumber,
        ).toHaveBeenCalledTimes(1);
        expect(
          userDbService.updateCityAndDepartamentByPhoneNumber,
        ).toHaveBeenCalledWith(
          mockUserUpdateLocate.phoneNumber,
          mockUserUpdateLocate.updateLocation,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
    it('should update the user ExceptionDale  ', async () => {
      jest
        .spyOn(userDbService, 'updateCityAndDepartamentByPhoneNumber')
        .mockImplementation(() => {
          throw new Error('');
        });
      try {
        await service.updateCityAndDepartamentByPhoneNumber(
          mockUserUpdateLocate.phoneNumber,
          mockUserUpdateLocate.updateLocation,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('requeriments user', () => {
    it('calls the database service', async () => {
      const expectedResponse: RequirementsUserResponseData = {
        data: { locationRequired: true },
      };
      try {
        const response = await service.requirementsUser('test-email');
        expect(userDbService.locationRequired).toHaveBeenCalledTimes(1);
        expect(response).toEqual(expectedResponse);
      } catch (err) {}
    });
    it('should throw an InternalServerExceptionDale when an error occurs', async () => {
      const error = new Error('Some error message');
      jest.spyOn(userDbService, 'locationRequired').mockRejectedValue(error);
      await expect(service.requirementsUser('test-email')).rejects.toThrow(
        new InternalServerExceptionDale(ErrorCodesEnum.MUS025, error),
      );
    });
  });
});
