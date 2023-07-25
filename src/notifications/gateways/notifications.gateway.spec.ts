import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { NotificationsGateway } from './notifications.gateways';
import { AuthService } from '@dale/auth/auth.service';
import { ClientManagerGateway, GetNotificationsService } from '../services';

describe('NotificationsGateway', () => {
  let gateway: NotificationsGateway;
  let getNotificationsService: GetNotificationsService;
  let clientManagerGateway: ClientManagerGateway;
  let authService: AuthService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsGateway,
        {
          provide: GetNotificationsService,
          useValue: {},
        },
        {
          provide: ClientManagerGateway,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
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

    gateway = module.get<NotificationsGateway>(NotificationsGateway);
    getNotificationsService = module.get<GetNotificationsService>(
      GetNotificationsService,
    );
    clientManagerGateway =
      module.get<ClientManagerGateway>(ClientManagerGateway);
    authService = module.get<AuthService>(AuthService);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service and repository defined', () => {
    expect(gateway).toBeDefined();
    expect(getNotificationsService).toBeDefined();
    expect(clientManagerGateway).toBeDefined();
    expect(authService).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should update a notification date', async () => {
    const repositorySpy = jest.spyOn(logger, 'debug');
    const resp = gateway.afterInit();

    expect(resp).toBeUndefined();
    expect(repositorySpy).toBeCalledTimes(1);
  });
});
