import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { outputRole } from '@dale/testcases/dtos-testcases';
import { RoleRepository } from '../..';
import { CreateRoleService } from '../create-role.service';

describe('Create Role Service Testing', () => {
  let service: CreateRoleService;
  let repository: RoleRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRoleService,
        {
          provide: RoleRepository,
          useValue: {
            createRole: jest.fn(() => {
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

    service = module.get<CreateRoleService>(CreateRoleService);
    repository = module.get<RoleRepository>(RoleRepository);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should create a new role', async () => {
    const createRoleSpy = jest.spyOn(repository, 'createRole');
    const resp = service.run(outputRole);

    expect(resp).toBeDefined();
    expect(createRoleSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputRole);
  });
});
