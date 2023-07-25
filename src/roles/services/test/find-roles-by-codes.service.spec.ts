import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import {
  roleFound,
  transactionCodesArray,
} from '@dale/testcases/dtos-testcases';
import { RoleRepository } from '../..';
import { FindRolesByCodesService } from '../find-roles-by-codes.service';

describe('Find Codes by Role Service Testing', () => {
  let service: FindRolesByCodesService;
  let repository: RoleRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindRolesByCodesService,
        {
          provide: RoleRepository,
          useValue: {
            findRolesByCodes: jest.fn(() => {
              return Promise.resolve(roleFound);
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

    service = module.get<FindRolesByCodesService>(FindRolesByCodesService);
    repository = module.get<RoleRepository>(RoleRepository);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find the codes by role', async () => {
    const resp = await service.run(transactionCodesArray);

    expect(resp).toBeDefined();
    expect(resp).toEqual(roleFound);
  });
});
