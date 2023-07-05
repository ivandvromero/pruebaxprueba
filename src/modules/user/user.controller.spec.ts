import { of } from 'rxjs';
import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { createResponse, MockResponse } from 'node-mocks-http';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserServiceController } from './user.controller';
import { UserService } from './user.service';
import {
  AddUserDepositMock,
  headers,
  mockCreateuserRequest,
  mockTestUserRegistered,
  mockUpdateUser,
  mockUpdateUserNew,
  mockUserResponse,
  mockUserUpdateLocate,
  UpdateDeviceMock,
  UpdatePhoneNumberMock,
} from '../../../test/mock-data';
import { USER_STATUS_MAPPING } from '../../constants/user-status';
import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import {
  InternalServerExceptionDale,
  BadRequestExceptionDale,
  CustomException,
} from '@dale/manage-errors-nestjs';
import { ClientKafka } from '@nestjs/microservices';

let response: MockResponse<Response>;
describe('UserController', () => {
  let controller: UserServiceController;
  let spyUserService;
  let kafkaClient: ClientKafka;
  const responseError = {
    response: { code: 'IBT004' },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useFactory: () => ({
            validateUserExist: jest.fn(() =>
              Promise.resolve({
                phoneNumber: '3115952183',
                accountsNumber: ['000000123777', '000000123701'],
              }),
            ),
            createUser: jest.fn(() => mockTestUserRegistered),
            findUser: jest.fn(() => mockUserResponse),
            updateUserByEmail: jest.fn(() => Promise.resolve({ affected: 1 })),
            updateUserById: jest.fn(() => Promise.resolve({ affected: 1 })),
            updateCityAndDepartamentByPhoneNumber: jest.fn(() =>
              Promise.resolve({ affected: 1 }),
            ),
            AddUserDeposit: jest.fn(),
            updateUserEvent: jest.fn(() => true),
          }),
        },
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
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
      controllers: [UserServiceController],
    }).compile();

    controller = module.get<UserServiceController>(UserServiceController);
    spyUserService = module.get<UserService>(UserService);
    kafkaClient = module.get<ClientKafka>('KAFKA_CLIENT');
    response = createResponse();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(spyUserService).toBeDefined();
    expect(kafkaClient).toBeDefined();
    expect(response).toBeDefined();
  });

  describe('validate if account number exits', () => {
    it('should return http 200 and correct result', async () => {
      const okResultMock = {
        data: {
          phoneNumber: '3115952183',
          accountsNumber: ['000000123777', '000000123701'],
        },
      };

      const request = {
        accountNumber: '000000123777',
        phoneNumber: '',
      };
      await controller.validateUserExist(request, response, null);
      const result = response._getData();
      const statusCode = response.statusCode;
      expect(statusCode).toEqual(HttpStatus.OK);
      expect(result).toEqual(okResultMock);
      expect(spyUserService.validateUserExist).toHaveBeenCalledTimes(1);
      expect(spyUserService.validateUserExist).toHaveBeenCalledWith(
        '000000123777',
        '',
      );
    });
  });

  describe('handle Status Update', () => {
    it('should validate Status Update', async () => {
      const message = {
        value: {
          userId: mockUserResponse.id,
          idnvStatus: mockUserResponse.status,
          riskProfile: mockUserResponse.riskProfile,
          trackingId: 'test-id',
        },
      };
      const userStatus = USER_STATUS_MAPPING[mockUserResponse.status];
      await controller.handleIdnvStatusUpdate(message);
      expect(spyUserService.updateUserById).toBeCalledTimes(1);
      expect(spyUserService.updateUserById).toHaveBeenCalledWith(
        mockUserResponse.id,
        {
          status: userStatus,
          riskProfile: mockUserResponse.riskProfile,
        },
      );
    });
  });

  describe('CRUD user', () => {
    afterEach(() => {
      spyUserService.createUser.mockClear();
      spyUserService.findUser.mockClear();
      spyUserService.updateUserByEmail.mockClear();
      spyUserService.updateUserById.mockClear();
      spyUserService.AddUserDeposit.mockClear();
    });

    describe('Get user', () => {
      response = createResponse();
      const testParams = {
        documentNumber: '1000622841',
      };

      it('should get user and return correct result', async () => {
        const result = await controller.getUser(testParams);
        expect(result).toEqual({ data: mockUserResponse });
        expect(spyUserService.findUser).toBeCalledTimes(1);
        expect(spyUserService.findUser).toHaveBeenCalledWith(
          testParams.documentNumber,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });
      it('should get user and return correct result Error', async () => {
        spyUserService.findUser.mockImplementationOnce(() =>
          Promise.reject(
            new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
          ),
        );
        try {
          await controller.getUser(testParams);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestExceptionDale);
        }
      });
    });

    it('should update user and return correct result', async () => {
      await controller.updateUser({
        ...mockUpdateUserNew,
      });
      expect(spyUserService.updateUserByEmail).toBeCalledTimes(1);
      expect(spyUserService.updateUserByEmail).toHaveBeenCalledWith(
        mockUpdateUser.email,
        {
          address: mockUpdateUserNew.address,
          firstName: mockUpdateUserNew.firstName,
          dob: mockUpdateUserNew.dob,
          lastName: mockUpdateUserNew.lastName,
          phoneNumber: mockUpdateUserNew.phoneNumber,
          phoneNumberVerified: mockUpdateUserNew.phoneNumberVerified,
          riskProfile: mockUpdateUserNew.riskProfile,
          status: mockUpdateUserNew.status,
        },
      );
    });
    it('should update user and return correct result Error', async () => {
      spyUserService.updateUserByEmail.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        await controller.updateUser({
          ...mockUpdateUserNew,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });

    it('should update PhoneNumber and return correct result', async () => {
      await controller.updatePhoneNumber({
        ...UpdatePhoneNumberMock,
      });
      expect(spyUserService.updateUserById).toBeCalledTimes(1);
      expect(spyUserService.updateUserById).toHaveBeenCalledWith('test-id', {
        phoneNumber: UpdatePhoneNumberMock.phoneNumber,
        phoneNumberVerified: false,
      });
    });
    it('should update Device and return correct result', async () => {
      await controller.updateDevice({
        ...UpdateDeviceMock,
      });
      expect(spyUserService.updateUserById).toBeCalledTimes(1);
      expect(spyUserService.updateUserById).toHaveBeenCalledWith('test-id', {
        deviceId: 'mock',
      });
    });
    it('should update PhoneNumber and return correct result Error', async () => {
      spyUserService.updateUserById.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        await controller.updatePhoneNumber({
          ...UpdatePhoneNumberMock,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });

    it('should add user deposit and return correct result', async () => {
      const result = await controller.AddUserDeposit({
        ...AddUserDepositMock,
      });
      expect(spyUserService.AddUserDeposit).toBeCalledTimes(1);
      expect(spyUserService.AddUserDeposit).toHaveBeenCalledWith({
        userId: AddUserDepositMock.userId,
        accountNumber: AddUserDepositMock.accountNumber,
      });
      expect(result).toBeUndefined();
    });
    it('should add user deposit and return correct result Error', async () => {
      spyUserService.AddUserDeposit.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        await controller.AddUserDeposit({
          ...AddUserDepositMock,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });

  describe('create User', () => {
    it('Success', async () => {
      const result = await controller.createUser(
        mockCreateuserRequest,
        headers,
      );
      expect(result).toEqual(mockTestUserRegistered);
    });

    it('Fail catch Error', async () => {
      spyUserService.createUser.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        await controller.createUser(mockCreateuserRequest, headers);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });

    it('Fail custom Error', async () => {
      spyUserService.createUser.mockImplementationOnce(() =>
        Promise.reject(
          new BadRequestExceptionDale(ErrorCodesEnum.MUS000, responseError),
        ),
      );
      try {
        await controller.createUser(mockCreateuserRequest, headers);
      } catch (err) {
        expect(err).toBeInstanceOf(CustomException);
      }
    });
    it('should update location and return correct result', async () => {
      await controller.updateLocateUser(
        mockUserUpdateLocate.updateLocation,
        mockUserUpdateLocate.phoneNumber,
        headers,
      );
      expect(
        spyUserService.updateCityAndDepartamentByPhoneNumber,
      ).toBeCalledTimes(1);
      expect(
        spyUserService.updateCityAndDepartamentByPhoneNumber,
      ).toHaveBeenCalledWith(
        mockUserUpdateLocate.phoneNumber,
        mockUserUpdateLocate.updateLocation,
      );
    });
    it('should update location and return correct result Error', async () => {
      spyUserService.updateCityAndDepartamentByPhoneNumber.mockImplementationOnce(
        () =>
          Promise.reject(
            new BadRequestExceptionDale(ErrorCodesEnum.MUS004, responseError),
          ),
      );
      try {
        await controller.updateLocateUser(
          mockUserUpdateLocate.updateLocation,
          mockUserUpdateLocate.phoneNumber,
          headers,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
  describe('Requeriments User', () => {
    it('user required ', async () => {
      try {
        await controller.requirementsUser('test-email', headers);
        expect(spyUserService.requirementsUser).toBeCalledTimes(1);
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
      }
    });
  });
});
