import { Test, TestingModule } from '@nestjs/testing';
import { Logger, LoggerModule } from '@dale/logger-nestjs';
import { CreateRoleController } from '../create-role.controller';
import { CreateRoleService } from '../../services/create-role.service';
import { DynamodbModule } from '@dale/aws-nestjs';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';
import { outputRole } from '@dale/testcases/dtos-testcases';

describe('Create Role Controller Testing', () => {
  let controller: CreateRoleController;
  let service: CreateRoleService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateRoleController],
      providers: [
        {
          provide: CreateRoleService,
          useValue: {
            run: jest.fn(() => {
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
      imports: [
        DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
        LoggerModule.forRoot({ context: 'Role MODULE' }),
      ],
    }).compile();

    controller = module.get<CreateRoleController>(CreateRoleController);
    service = module.get<CreateRoleService>(CreateRoleService);
    logger = module.get<Logger>(Logger);
  });

  it('Should be controller defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should create a new role', async () => {
    const repositorySpy = jest.spyOn(service, 'run');
    const resp = controller.createRole(outputRole);

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputRole);
  });
});
