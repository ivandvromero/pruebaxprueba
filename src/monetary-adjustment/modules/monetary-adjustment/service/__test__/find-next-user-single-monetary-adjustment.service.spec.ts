import {
  emailFound,
  roleFound,
  transactionCodeFound,
} from '@dale/testcases/dtos-testcases';
import { UseWorkBalancerService } from '@dale/user-work-balancer/modules/services/use-work-balancer.service';
import { TestingModule, Test } from '@nestjs/testing';
import { FindNextUserSingleMonetaryAdjustmentService } from '../find-next-user-single-monetary-adjustment.service';
import { Logger } from '@dale/logger-nestjs';
import { TransactionCodeService } from '@dale/transaction-codes/services';

describe('FindNextUserSingleMonetaryAdjustmentService', () => {
  let service: FindNextUserSingleMonetaryAdjustmentService;
  let logger: Logger;
  let transactionCodeService: TransactionCodeService;
  let useWorkBalancerService: UseWorkBalancerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindNextUserSingleMonetaryAdjustmentService,
        TransactionCodeService,
        UseWorkBalancerService,
        {
          provide: TransactionCodeService,
          useValue: {
            getRolesByCode: jest.fn(() => {
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

    service = module.get<FindNextUserSingleMonetaryAdjustmentService>(
      FindNextUserSingleMonetaryAdjustmentService,
    );
    logger = module.get<Logger>(Logger);
    transactionCodeService = module.get<TransactionCodeService>(
      TransactionCodeService,
    );
    useWorkBalancerService = module.get<UseWorkBalancerService>(
      UseWorkBalancerService,
    );
  });

  it('Should be service and repository defined', () => {
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
    expect(transactionCodeService).toBeDefined();
    expect(useWorkBalancerService).toBeDefined();
  });

  it('Should found an email based on the code', async () => {
    const resp = await service.run(transactionCodeFound, 1);
    expect(resp).toEqual(emailFound);
  });
});
