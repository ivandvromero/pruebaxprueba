import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { NotificationsRepository } from '@dale/notifications/repositories/notifications/notifications.repository';
import {
  createNotification,
  respCreateNotification,
} from '@dale/testcases/notifications-testcases';
import { CreateNotificationService } from '../create-notification.service';
import { NotificationsGateway } from '../..';
import { ClientManagerGateway } from '../client-manager-gateway.service';

describe('CreateNotificationService', () => {
  let service: CreateNotificationService;
  let repository: NotificationsRepository;
  let notificationsGateway: NotificationsGateway;
  let clientManagerGateway: ClientManagerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNotificationService,
        {
          provide: NotificationsRepository,
          useValue: {
            createNotification: jest.fn(() => {
              return Promise.resolve(respCreateNotification);
            }),
          },
        },
        {
          provide: NotificationsGateway,
          useValue: {},
        },
        {
          provide: ClientManagerGateway,
          useValue: {
            findClient: jest.fn(() => {
              return Promise.resolve();
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

    service = module.get<CreateNotificationService>(CreateNotificationService);
    repository = module.get<NotificationsRepository>(NotificationsRepository);
    notificationsGateway =
      module.get<NotificationsGateway>(NotificationsGateway);
    clientManagerGateway =
      module.get<ClientManagerGateway>(ClientManagerGateway);
  });

  it('Should be service and repository defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(notificationsGateway).toBeDefined();
    expect(clientManagerGateway).toBeDefined();
  });

  it('Should update a notification date', async () => {
    const repositorySpy = jest.spyOn(repository, 'createNotification');
    const resp = await service.run(createNotification);

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(true);
  });
});
