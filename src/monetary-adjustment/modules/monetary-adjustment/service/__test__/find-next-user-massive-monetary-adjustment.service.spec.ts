import { emailFound, roleFound } from '@dale/testcases/dtos-testcases';
import { UseWorkBalancerService } from '@dale/user-work-balancer/modules/services/use-work-balancer.service';
import { TestingModule, Test } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { FindNextUserMassiveMonetaryAdjustmentService } from '../find-next-user-massive-monetary-adjustment.service';
import { FindRolesByCodesService } from '@dale/roles/services';
import { massiveAdjustmentDto } from '@dale/testcases/massive-testcases';

describe('FindNextUserSingleMonetaryAdjustmentService', () => {
  let service: FindNextUserMassiveMonetaryAdjustmentService;
  let logger: Logger;
  let findRolesByCodesService: FindRolesByCodesService;
  let useWorkBalancerService: UseWorkBalancerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindNextUserMassiveMonetaryAdjustmentService,
        FindRolesByCodesService,
        UseWorkBalancerService,
        {
          provide: FindRolesByCodesService,
          useValue: {
            run: jest.fn(() => {
              return Promise.resolve(roleFound);
            }),
          },
        },
        {
          provide: UseWorkBalancerService,
          useValue: {
            getRandomEmail: jest.fn(() => {
              return Promise.resolve({
                email: 'backoffice-validator@yopmail.com',
              });
            }),
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

    service = module.get<FindNextUserMassiveMonetaryAdjustmentService>(
      FindNextUserMassiveMonetaryAdjustmentService,
    );
    logger = module.get<Logger>(Logger);
    findRolesByCodesService = module.get<FindRolesByCodesService>(
      FindRolesByCodesService,
    );
    useWorkBalancerService = module.get<UseWorkBalancerService>(
      UseWorkBalancerService,
    );
  });

  it('Should be service and repository defined', () => {
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
    expect(findRolesByCodesService).toBeDefined();
    expect(useWorkBalancerService).toBeDefined();
  });

  it('Should found an email based on the codes', async () => {
    const resp = await service.run(massiveAdjustmentDto.adjustments, 1);
    expect(resp).toEqual(emailFound);
  });
});
