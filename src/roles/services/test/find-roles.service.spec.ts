import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { outputRole } from '@dale/testcases/dtos-testcases';
import { RoleRepository } from '../..';
import { FindRolesService } from '../find-roles.service';

describe('Find Codes by Role Service Testing', () => {
  let service: FindRolesService;
  let repository: RoleRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindRolesService,
        {
          provide: RoleRepository,
          useValue: {
            findRoles: jest.fn(() => {
              return Promise.resolve([outputRole]);
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

    service = module.get<FindRolesService>(FindRolesService);
    repository = module.get<RoleRepository>(RoleRepository);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find all roles', async () => {
    const createRoleSpy = jest.spyOn(repository, 'findRoles');
    const resp = service.run();

    expect(resp).toBeDefined();
    expect(createRoleSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual([outputRole]);
  });
});
