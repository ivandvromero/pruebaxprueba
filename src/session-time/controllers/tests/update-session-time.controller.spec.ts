import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';
import { DynamodbModule } from '@dale/aws-nestjs';
import { ConfigService } from '@nestjs/config';
import { UpdateSessionTimeController } from '../update-session-time.controller';
import { UpdateSessionTimeService } from '../..';
import { updateSessionTime } from '@dale/testcases/sesion-time-testcases';

describe('Update session time controller Testing', () => {
  let controller: UpdateSessionTimeController;
  let service: UpdateSessionTimeService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSessionTimeController,
        {
          provide: UpdateSessionTimeService,
          useValue: {
            run: jest.fn(() => {
              return Promise.resolve(updateSessionTime);
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

    controller = module.get<UpdateSessionTimeController>(
      UpdateSessionTimeController,
    );
    service = module.get<UpdateSessionTimeService>(UpdateSessionTimeService);
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should find all roles', async () => {
    const serviceSpy = jest.spyOn(service, 'run');
    const resp = controller.updateSessionTime(updateSessionTime);

    expect(resp).toBeDefined();
    expect(serviceSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(updateSessionTime);
  });
});
