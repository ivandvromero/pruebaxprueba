import { Test, TestingModule } from '@nestjs/testing';
import { Logger, LoggerModule } from '@dale/logger-nestjs';
import { FindRolesController } from '../find-roles.controller';
import { FindRolesService } from '../../services/find-roles.service';
import { DynamodbModule } from '@dale/aws-nestjs';

import { outputRole } from '@dale/testcases/dtos-testcases';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';

describe('Find Roles Controller Testing', () => {
  let controller: FindRolesController;
  let service: FindRolesService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindRolesController],
      providers: [
        {
          provide: FindRolesService,
          useValue: {
            run: jest.fn(() => {
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
      imports: [
        DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
        LoggerModule.forRoot({ context: 'Role MODULE' }),
      ],
    }).compile();

    controller = module.get<FindRolesController>(FindRolesController);
    service = module.get<FindRolesService>(FindRolesService);
    logger = module.get<Logger>(Logger);
  });

  it('Should be controller defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find roles', async () => {
    const repositorySpy = jest.spyOn(service, 'run');
    const resp = controller.run();

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual([outputRole]);
  });
});
