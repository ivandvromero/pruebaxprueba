import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { ClientManagerGateway } from '../client-manager-gateway.service';
import {
  notificationEmail,
  notificationSocketId,
} from '@dale/testcases/notifications-testcases';

describe('CreateNotificationService', () => {
  let service: ClientManagerGateway;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientManagerGateway,
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn().mockImplementation(),
            set: jest.fn().mockImplementation(),
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

    service = module.get<ClientManagerGateway>(ClientManagerGateway);
    cacheManager = module.get<any>('CACHE_MANAGER');
  });

  it('Should be service and repository defined', () => {
    expect(service).toBeDefined();
  });

  it('Should register a client', async () => {
    const cacheManagerGetSpy = jest.spyOn(cacheManager, 'get');
    const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set');

    const resp = await service.registerClient(
      notificationEmail,
      notificationSocketId,
    );

    expect(cacheManagerGetSpy).toHaveBeenCalledTimes(1);
    expect(cacheManagerSetSpy).toHaveBeenCalledTimes(1);
    expect(resp).toEqual(undefined);
  });

  it('Should delete a client', async () => {
    const cacheValue = {
      [notificationSocketId]: { email: 'test@example.com' },
    };

    const cacheManagerSetSpy = jest
      .spyOn(cacheManager, 'set')
      .mockImplementation();

    const cacheManagerGetSpy = jest
      .spyOn(cacheManager, 'get')
      .mockResolvedValue(cacheValue);

    await service.removeCLient(notificationSocketId);

    expect(cacheManagerGetSpy).toHaveBeenCalledTimes(1);
    expect(cacheManagerSetSpy).toHaveBeenCalledTimes(1);
  });

  it('should find a client by email', async () => {
    const cacheValue = {
      [notificationSocketId]: { email: notificationEmail },
    };

    jest.spyOn(cacheManager, 'get').mockResolvedValue(cacheValue);

    const result = await service.findClient(notificationEmail);

    expect(result).toEqual(notificationSocketId);
  });
});
