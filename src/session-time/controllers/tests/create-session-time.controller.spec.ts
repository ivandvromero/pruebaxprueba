import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';
import { DynamodbModule } from '@dale/aws-nestjs';
import { ConfigService } from '@nestjs/config';
import { CreateSessionTimeService } from '../../services/create-session-time.service';
import { CreateSessionTimeController } from '../create-session-time.controller';
import {
  createSessionTime,
  createSessionTimeResp,
} from '@dale/testcases/sesion-time-testcases';

describe('Create session time controller testing', () => {
  let controller: CreateSessionTimeController;
  let service: CreateSessionTimeService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSessionTimeController,
        {
          provide: CreateSessionTimeService,
          useValue: {
            run: jest.fn(() => {
              return Promise.resolve(createSessionTimeResp);
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
      imports: [DynamodbModule.forRoot({ tableName: DYNAMO_TABLE })],
    }).compile();

    controller = module.get<CreateSessionTimeController>(
      CreateSessionTimeController,
    );
    service = module.get<CreateSessionTimeService>(CreateSessionTimeService);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find all roles', async () => {
    const serviceSpy = jest.spyOn(service, 'run');
    const resp = controller.createSessionTimeController(createSessionTime);

    expect(resp).toBeDefined();
    expect(serviceSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(createSessionTimeResp);
  });
});
