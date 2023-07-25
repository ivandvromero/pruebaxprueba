import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { NotificationsRepository } from '@dale/notifications/repositories/notifications/notifications.repository';
import { notificationsPaginated } from '@dale/testcases/notifications-testcases';
import { GetNotificationsService } from '../get-notifications.service';

describe('GetNotificationsService', () => {
  let service: GetNotificationsService;
  let repository: NotificationsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetNotificationsService,
        {
          provide: NotificationsRepository,
          useValue: {
            getNotifications: jest.fn(() => {
              return Promise.resolve(notificationsPaginated);
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetNotificationsService>(GetNotificationsService);
    repository = module.get<NotificationsRepository>(NotificationsRepository);
  });

  it('Should be service and repository defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('Should update a notification date', async () => {
    const repositorySpy = jest.spyOn(repository, 'getNotifications');
    const resp = await service.run('capturer@test.com');

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(notificationsPaginated);
  });
});
