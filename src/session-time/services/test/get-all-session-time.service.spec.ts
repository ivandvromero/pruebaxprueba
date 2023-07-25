import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import {
  allSessionTimeResp,
  createSessionTimeResp,
} from '@dale/testcases/sesion-time-testcases';
import { SessionTimeRepository } from '../..';
import { GetAllSessionTimeService } from '../get-all-session-time.service';

describe('Create session time controller testing', () => {
  let service: GetAllSessionTimeService;
  let repository: SessionTimeRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllSessionTimeService,
        {
          provide: SessionTimeRepository,
          useValue: {
            getAllSessionTime: jest.fn(() => {
              return Promise.resolve([createSessionTimeResp]);
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

    service = module.get<GetAllSessionTimeService>(GetAllSessionTimeService);
    repository = module.get<SessionTimeRepository>(SessionTimeRepository);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find the time sessions', async () => {
    const repositorySpy = jest.spyOn(repository, 'getAllSessionTime');
    const resp = await service.run();

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(allSessionTimeResp);
  });
});
