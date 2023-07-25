import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { outputAdjustment } from '@dale/testcases/dtos-testcases';
import { NotificationsGateway } from '@dale/notifications/gateways/notifications.gateways';
import { NotificationsRepository } from '@dale/notifications/repositories/notifications/notifications.repository';
import { ClientManagerGateway } from '../client-manager-gateway.service';
import { UpdateNotificationWithoutIdService } from '../update-notification-date-without-id.service';
import {
  notificationRelatedId,
  respCreateNotification,
} from '@dale/testcases/notifications-testcases';
import { DateToUpdateEnum } from '@dale/notifications/shared';

describe('UpdateNotificationsDateWithoutIdService', () => {
  let service: UpdateNotificationWithoutIdService;
  let repository: NotificationsRepository;
  let notificationsGateway: NotificationsGateway;
  let clientManagerGateway: ClientManagerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateNotificationWithoutIdService,
        {
          provide: NotificationsRepository,
          useValue: {
            findNotification: jest.fn(() => {
              return Promise.resolve(respCreateNotification);
            }),
            updateNotificationsDate: jest.fn(() => {
              return Promise.resolve(true);
            }),
            getNotifications: jest.fn(() => {
              return Promise.resolve([respCreateNotification]);
            }),
          },
        },
        {
          provide: NotificationsGateway,
          useValue: {
            server: jest.fn(() => {
              return Promise.resolve(outputAdjustment);
            }),
          },
        },
        {
          provide: ClientManagerGateway,
          useValue: {
            findClient: jest.fn(() => {
              return Promise.resolve(true);
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

    service = module.get<UpdateNotificationWithoutIdService>(
      UpdateNotificationWithoutIdService,
    );
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
    const repositorySpy = jest.spyOn(repository, 'findNotification');
    const resp = await service.run(
      notificationRelatedId,
      'capturer@test.com',
      DateToUpdateEnum.NOTIFIED_AT,
    );

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(true);
  });
});
