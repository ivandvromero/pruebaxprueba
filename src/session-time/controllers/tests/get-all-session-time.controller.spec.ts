import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';
import { DynamodbModule } from '@dale/aws-nestjs';
import { ConfigService } from '@nestjs/config';
import { allSessionTimeResp } from '@dale/testcases/sesion-time-testcases';
import { GetAllSessionTimeController } from '../get-all-session-time.controller';
import { GetAllSessionTimeService } from '../../services/get-all-session-time.service';

describe('Get all session time controller testing', () => {
  let controller: GetAllSessionTimeController;
  let service: GetAllSessionTimeService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllSessionTimeController,
        {
          provide: GetAllSessionTimeService,
          useValue: {
            run: jest.fn(() => {
              return Promise.resolve(allSessionTimeResp);
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

    controller = module.get<GetAllSessionTimeController>(
      GetAllSessionTimeController,
    );
    service = module.get<GetAllSessionTimeService>(GetAllSessionTimeService);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find all roles', async () => {
    const serviceSpy = jest.spyOn(service, 'run');
    const resp = controller.getAllSessionTime();

    expect(resp).toBeDefined();
    expect(serviceSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(allSessionTimeResp);
  });
});
