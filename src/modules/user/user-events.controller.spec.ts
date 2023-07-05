import { Test, TestingModule } from '@nestjs/testing';
import { UserEventsController } from './user-events.controller';
import { of } from 'rxjs';
import { Logger } from '@dale/logger-nestjs';
import { UserService } from './user.service';
import {
  mockKafkaContext,
  mockTestUserRegistered,
  mockUserResponse,
  updateUserEventRequest,
} from '../../../test/mock-data';
import { BadRequestException } from '@nestjs/common';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

describe('UserEventsController', () => {
  let controller: UserEventsController;
  let spyUserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserEventsController],
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
            AddUserDeposit: jest.fn(),
            updateUserEvent: jest.fn(() => true),
            kafkaQueueRetry: jest.fn(),
            insertEnrollmentQueueStepData: jest.fn(),
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
    }).compile();

    controller = module.get<UserEventsController>(UserEventsController);
    spyUserService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Update User Event', () => {
    it('should Update user event and return correct result', async () => {
      const result = await controller.listenEventUpdateUserDb(
        updateUserEventRequest,
      );
      expect(result).toEqual(true);
    });
    it('should create user and return correct result Error', async () => {
      spyUserService.updateUserEvent.mockImplementationOnce(() =>
        Promise.reject(new BadRequestException('000', 'Error desconocido')),
      );
      try {
        await controller.listenEventUpdateUserDb(
          updateUserEventRequest,
          mockKafkaContext,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerExceptionDale);
      }
    });

    it('result is Falsy', async () => {
      spyUserService.updateUserEvent.mockImplementationOnce(() =>
        Promise.resolve(''),
      );
      try {
        await controller.listenEventUpdateUserDb(
          updateUserEventRequest,
          mockKafkaContext,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
});
