import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { updateSessionTime } from '@dale/testcases/sesion-time-testcases';
import { SessionTimeRepository } from '../..';
import { UpdateSessionTimeService } from '../update-session-time.service';

describe('Create session time controller testing', () => {
  let service: UpdateSessionTimeService;
  let repository: SessionTimeRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSessionTimeService,
        {
          provide: SessionTimeRepository,
          useValue: {
            updateSessionTime: jest.fn(() => {
              return Promise.resolve(updateSessionTime);
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

    service = module.get<UpdateSessionTimeService>(UpdateSessionTimeService);
    repository = module.get<SessionTimeRepository>(SessionTimeRepository);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should update a time sessions', async () => {
    const repositorySpy = jest.spyOn(repository, 'updateSessionTime');
    const resp = await service.run(updateSessionTime);

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(updateSessionTime);
  });
});
