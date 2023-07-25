import { NotificationsRepository } from './notifications.repository';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@dale/logger-nestjs';
import {
  createNotification,
  notificationId,
  notificationRelatedId,
  notificationsPaginated,
  respCreateNotification,
} from '@dale/testcases/notifications-testcases';
import { DateToUpdateEnum } from '@dale/notifications/shared/enums/date-to-update.enum';

describe('Notification Repository Testing', () => {
  let repository: NotificationsRepository;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          context: 'Notifications Database Module',
        }),
      ],
      providers: [
        NotificationsRepository,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: jest.fn().mockResolvedValue(true),
              create: jest.fn().mockResolvedValue(respCreateNotification),
              find: jest.fn().mockResolvedValue([respCreateNotification]),
              findOne: jest.fn().mockResolvedValue(respCreateNotification),
              count: jest.fn().mockResolvedValue(1),
              update: jest.fn(),
            })),
            isDbConnectionAlive: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    repository = module.get<NotificationsRepository>(NotificationsRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('Should be repository defined', () => {
    expect(repository).toBeDefined();
    expect(databaseService).toBeDefined();
  });

  it('should return true when isDbConnectionAlive function get called', async () => {
    const result = await repository.isDbConnectionAlive();
    expect(result).toBe(true);
  });

  it('Should create a new notification', async () => {
    await repository.onModuleInit();
    const resp = await repository.createNotification(createNotification);
    expect(resp).toEqual(respCreateNotification);
  });

  it('Should return notificationsPaginated', async () => {
    await repository.onModuleInit();
    const resp = await repository.getNotifications('capturer@test.com');
    expect(resp).toEqual(notificationsPaginated);
  });

  it('Should return notificationsPaginated', async () => {
    await repository.onModuleInit();
    const resp = await repository.getNotifications('capturer@test.com');
    expect(resp).toEqual(notificationsPaginated);
  });

  it('Should update a notification attended at date', async () => {
    await repository.onModuleInit();
    const resp = await repository.updateNotificationsDate(
      notificationId,
      DateToUpdateEnum.ATTENDED_AT,
    );
    expect(resp).toEqual(true);
  });

  it('Should update a notification attended at date', async () => {
    await repository.onModuleInit();
    const resp = await repository.updateNotificationsDate(
      notificationId,
      DateToUpdateEnum.VIEWED_AT,
    );
    expect(resp).toEqual(true);
  });

  it('Should return a notification searched by related id and email', async () => {
    await repository.onModuleInit();
    const resp = await repository.findNotification(
      notificationRelatedId,
      'capturer@test.com',
    );
    expect(resp).toEqual(respCreateNotification);
  });
});
