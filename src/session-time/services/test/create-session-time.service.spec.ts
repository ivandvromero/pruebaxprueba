import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { CreateSessionTimeService } from '../create-session-time.service';
import {
  createSessionTime,
  createSessionTimeResp,
  roleFound,
} from '@dale/testcases/sesion-time-testcases';
import { SessionTimeRepository } from '../..';
import { FindRoleService } from '@dale/roles/services';

describe('Create session time controller testing', () => {
  let service: CreateSessionTimeService;
  let findRoleService: FindRoleService;
  let repository: SessionTimeRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSessionTimeService,
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
            createSessionTime: jest.fn(() => {
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

    service = module.get<CreateSessionTimeService>(CreateSessionTimeService);
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

  it('Should create a time session', async () => {
    const roleServiceSpy = jest.spyOn(findRoleService, 'run');
    const repositorySpy = jest.spyOn(repository, 'createSessionTime');
    const resp = await service.run(createSessionTime);

    expect(resp).toBeDefined();
    expect(roleServiceSpy).toBeCalledTimes(1);
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(createSessionTimeResp);
  });
});
