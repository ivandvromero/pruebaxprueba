import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { outputFindCodesByRole } from '@dale/testcases/dtos-testcases';
import { RoleRepository } from '../..';
import { FindCodesByRoleService } from '../find-codes-by-role.service';

describe('Find Codes by Role Service Testing', () => {
  let service: FindCodesByRoleService;
  let repository: RoleRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCodesByRoleService,
        {
          provide: RoleRepository,
          useValue: {
            findCodesByRole: jest.fn(() => {
              return Promise.resolve(outputFindCodesByRole);
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

    service = module.get<FindCodesByRoleService>(FindCodesByRoleService);
    repository = module.get<RoleRepository>(RoleRepository);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find the codes by role', async () => {
    const createRoleSpy = jest.spyOn(repository, 'findCodesByRole');
    const resp = service.run('GpotVerifier');

    expect(resp).toBeDefined();
    expect(createRoleSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputFindCodesByRole);
  });
});
