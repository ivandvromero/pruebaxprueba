import { Test, TestingModule } from '@nestjs/testing';
import { Logger, LoggerModule } from '@dale/logger-nestjs';
import { FindCodesByRoleController } from '../find-codes-by-role.controller';
import { FindCodesByRoleService } from '../../services/find-codes-by-role.service';
import { DynamodbModule } from '@dale/aws-nestjs';
import { outputFindCodesByRole } from '@dale/testcases/dtos-testcases';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';

describe('Find Codes by Role Controller Testing', () => {
  let controller: FindCodesByRoleController;
  let service: FindCodesByRoleService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindCodesByRoleController],
      providers: [
        {
          provide: FindCodesByRoleService,
          useValue: {
            run: jest.fn(() => {
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
      imports: [
        DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
        LoggerModule.forRoot({ context: 'Roles MODULE' }),
      ],
    }).compile();

    controller = module.get<FindCodesByRoleController>(
      FindCodesByRoleController,
    );
    service = module.get<FindCodesByRoleService>(FindCodesByRoleService);
    logger = module.get<Logger>(Logger);
  });

  it('Should be controller defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find all codes by role', async () => {
    const repositorySpy = jest.spyOn(service, 'run');
    const resp = controller.run({
      user: {
        'https://panel-administrativo/roles': ['MonetaryAdjustment-Approver'],
        user_id: 'auth0|63ee4',
        email: 'backoffice-approver@yopmail.com',
        name: 'Approver',
        iss: 'https://dale-dev.us.auth0.com/',
        sub: 'auth0|63ee4',
        aud: ['https://panel-administrativo/', 'https://dale.com/userinfo'],
        iat: 168608,
        exp: 168614,
        azp: 'yQb2rkdkd',
        scope: 'openid profile email',
        permissions: ['MonetaryAdjustment:read', 'Notifications:read'],
      },
    });

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputFindCodesByRole);
  });

  it('Should find all codes by role with coverage in request.', async () => {
    const repositorySpy = jest.spyOn(service, 'run');
    const resp = controller.run(undefined);

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputFindCodesByRole);
  });
});
