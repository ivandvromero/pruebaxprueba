import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@dale/logger-nestjs';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { MonetaryAdjustmentRepository } from '../monetary-adjustment/monetary-adjustment.repository';
import { AdjustmentsRegisterRepository } from './adjustment-registrer.repository';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import {
  adjustmentWithRelations,
  searchQueryWithParams,
  getReportsPaginated,
} from '@dale/testcases/massive-testcases';
import { CreateNotificationService } from '@dale/notifications/services/create-notification.service';
import { UpdateNotificationWithoutIdService } from '@dale/notifications/services/update-notification-date-without-id.service';

describe('Monetary Adjustment Repository Testing', () => {
  let repository: AdjustmentsRegisterRepository;
  let databaseService: DatabaseService;
  let createNotificationService: CreateNotificationService;
  let updateNotificationService: UpdateNotificationWithoutIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          context: 'Adjustment Register Database Service',
        }),
      ],
      providers: [
        AdjustmentsRegisterRepository,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              find: jest.fn().mockResolvedValue([adjustmentWithRelations]),
              count: jest.fn().mockResolvedValue(1),
            })),
            isDbConnectionAlive: jest.fn(() => true),
          }),
        },
        {
          provide: CreateNotificationService,
          useValue: {
            run: jest.fn(),
          },
        },
        {
          provide: UpdateNotificationWithoutIdService,
          useValue: {
            run: jest.fn(),
          },
        },
        MonetaryAdjustmentRepository,
      ],
    }).compile();

    repository = module.get<AdjustmentsRegisterRepository>(
      AdjustmentsRegisterRepository,
    );
    databaseService = module.get<DatabaseService>(DatabaseService);
    createNotificationService = module.get<CreateNotificationService>(
      CreateNotificationService,
    );
    updateNotificationService = module.get<UpdateNotificationWithoutIdService>(
      UpdateNotificationWithoutIdService,
    );
  });

  it('Should be repository defined', () => {
    expect(repository).toBeDefined();
    expect(databaseService).toBeDefined();
    expect(createNotificationService).toBeDefined();
    expect(updateNotificationService).toBeDefined();
  });

  it('should return true when isDbConnectionAlive function get called', async () => {
    const result = await repository.isDbConnectionAlive();
    expect(result).toBe(true);
  });

  it('Should return paginated adjustments that meet the dto conditions', async () => {
    await repository.onModuleInit();
    const resp = await repository.findAll(searchQueryWithParams);
    expect(resp).toEqual(getReportsPaginated);
  });

  it('Should return paginated adjustments that meet the dto conditions', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      find: jest.fn().mockRejectedValueOnce(new Error('Something went wrong')),
    });
    await repository.onModuleInit();
    await expect(repository.findAll(searchQueryWithParams)).rejects.toThrow(
      new NotFoundException(
        ErrorCodesEnum.BOS004,
        'Error al intentar obtener los ajustes monetarios.',
      ),
    );
  });
});
