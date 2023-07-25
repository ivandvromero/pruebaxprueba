import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { outputRole } from '@dale/testcases/dtos-testcases';
import { FindRoleService } from '../find-role.service';
import { RoleRepository } from '../..';

describe('Find Codes by Role Service Testing', () => {
  let service: FindRoleService;
  let repository: RoleRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindRoleService,
        {
          provide: RoleRepository,
          useValue: {
            findRole: jest.fn(() => {
              return Promise.resolve(outputRole);
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

    service = module.get<FindRoleService>(FindRoleService);
    repository = module.get<RoleRepository>(RoleRepository);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find all roles', async () => {
    const createRoleSpy = jest.spyOn(repository, 'findRole');
    const resp = service.run(outputRole.name);

    expect(resp).toBeDefined();
    expect(createRoleSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputRole);
  });
});
