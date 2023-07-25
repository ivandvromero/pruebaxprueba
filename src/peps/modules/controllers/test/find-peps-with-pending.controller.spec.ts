import { Test, TestingModule } from '@nestjs/testing';
import { FindPepsWithPendingController } from '../find-peps-with-pending.controller';
import { FindPepsWithPendingService } from '../../services/find-peps-with-pending.service';
import { DynamodbModule } from '@dale/aws-nestjs';
import { LoggerModule } from '@dale/logger-nestjs';
import { DYNAMO_TABLE } from '../../../../shared/constants/constants';
import { findPepsWithPendingResponse } from '../../../shared/mocks/test-cases';

describe('Find PEPS with pending status Testing', () => {
  let controller: FindPepsWithPendingController;
  let service: FindPepsWithPendingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
        LoggerModule.forRoot({ context: 'Peps MODULE' }),
      ],
      controllers: [FindPepsWithPendingController],
      providers: [
        {
          provide: FindPepsWithPendingService,
          useValue: {
            run: jest.fn(() => {
              return Promise.resolve(findPepsWithPendingResponse);
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<FindPepsWithPendingController>(
      FindPepsWithPendingController,
    );
    service = module.get<FindPepsWithPendingService>(
      FindPepsWithPendingService,
    );
  });

  it('Should controller be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('Should find peps with pending status.', async () => {
    const serviceSpy = jest.spyOn(service, 'run');
    const req = {
      user: {
        permissions: 'CommercialLeader:write',
      },
    };

    const resp = controller.run(req, { limit: 5, offset: 0 });

    expect(resp).toBeDefined();
    expect(serviceSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(findPepsWithPendingResponse);
  });
});
