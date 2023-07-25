import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { GetSessionTimeService } from '../../services/get-session-time.service';
import { GetSessionTimeController } from '../get-session-time.controller';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';
import { DynamodbModule } from '@dale/aws-nestjs';
import { ConfigService } from '@nestjs/config';
import { req } from '@dale/testcases/dtos-testcases';
import { sessionTimeRespTest } from '@dale/testcases/sesion-time-testcases';

describe('Get session time controller testing', () => {
  let controller: GetSessionTimeController;
  let service: GetSessionTimeService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSessionTimeController,
        {
          provide: GetSessionTimeService,
          useValue: {
            run: jest.fn(() => {
              return Promise.resolve(sessionTimeRespTest);
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

    controller = module.get<GetSessionTimeController>(GetSessionTimeController);
    service = module.get<GetSessionTimeService>(GetSessionTimeService);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find all roles', async () => {
    const serviceSpy = jest.spyOn(service, 'run');
    const resp = controller.getSessionTime(req);

    expect(resp).toBeDefined();
    expect(serviceSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(sessionTimeRespTest);
  });
});
