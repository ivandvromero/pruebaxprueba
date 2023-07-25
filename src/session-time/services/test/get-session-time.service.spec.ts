import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import {
  createSessionTimeResp,
  defaultSessionTimeRespTest,
  roleFound,
  sessionTimeRespTest,
} from '@dale/testcases/sesion-time-testcases';
import { FindRoleService } from '@dale/roles/services';
import { SessionTimeRepository } from '../..';
import { GetSessionTimeService } from '../get-session-time.service';

describe('Create session time controller testing', () => {
  let service: GetSessionTimeService;
  let findRoleService: FindRoleService;
  let repository: SessionTimeRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSessionTimeService,
        {
          provide: FindRoleService,
          useValue: {
            run: jest.fn(() => {
              return Promise.resolve(roleFound);
            }),
          },
        },
        {
          provide: SessionTimeRepository,
          useValue: {
            getSessionTime: jest.fn(() => {
              return Promise.resolve(createSessionTimeResp);
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetSessionTimeService>(GetSessionTimeService);
    findRoleService = module.get<FindRoleService>(FindRoleService);
    repository = module.get<SessionTimeRepository>(SessionTimeRepository);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(service).toBeDefined();
    expect(findRoleService).toBeDefined();
    expect(repository).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should return a session time object', async () => {
    const roleServiceSpy = jest.spyOn(findRoleService, 'run');
    const repositorySpy = jest.spyOn(repository, 'getSessionTime');
    const role = 'CallCenter';
    const resp = await service.run(role);

    expect(resp).toBeDefined();
    expect(roleServiceSpy).toBeCalledTimes(1);
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(sessionTimeRespTest);
  });

  it('Should return a default session time object', async () => {
    const roleServiceSpy = jest.spyOn(findRoleService, 'run');
    const repositorySpy = jest
      .spyOn(repository, 'getSessionTime')
      .mockResolvedValue(undefined);
    const role = 'CallCenter2';
    const resp = await service.run(role);

    expect(resp).toBeDefined();
    expect(roleServiceSpy).toBeCalledTimes(1);
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(defaultSessionTimeRespTest);
  });
});
