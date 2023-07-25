import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@dale/logger-nestjs';
import { MonetaryAdjustmentRepository } from './monetary-adjustment.repository';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import {
  BadRequestException,
  InternalServerException,
  NotFoundException,
} from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import {
  outputAdjustment,
  updateRegister,
  adjustmentDto,
  adjustmentErrorDto,
  adjustmentQuery,
  getAdjustmentResponseWithPagination,
  emptyAdjustmentQuery,
  findOneAdjustmentWithRelations,
  adjustmentId,
  newTransactionLevel,
  newAdjustmentState,
  comment,
  adjustmentMetadataDto,
  outputAdjustmentWithRelations,
  adjustmentMetadataDtoCapturer,
  rolesToFind,
} from '@dale/testcases/dtos-testcases';
import { CreateNotificationService } from '@dale/notifications/services/create-notification.service';
import { UpdateNotificationWithoutIdService } from '@dale/notifications/services/update-notification-date-without-id.service';

describe('Monetary Adjustment Repository Testing', () => {
  let repository: MonetaryAdjustmentRepository;
  let databaseService: DatabaseService;
  let createNotificationService: CreateNotificationService;
  let updateNotificationService: UpdateNotificationWithoutIdService;

  const mockSave = jest.fn(() => Promise.resolve(outputAdjustment));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          context: 'Monetary Adjustment - TypeORM Adapter MODULE',
        }),
      ],
      providers: [
        MonetaryAdjustmentRepository,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: mockSave,
              create: jest.fn().mockResolvedValue(outputAdjustment),
              find: jest.fn().mockResolvedValue([outputAdjustment]),
              findOne: jest
                .fn()
                .mockResolvedValue(outputAdjustmentWithRelations),
              count: jest.fn().mockResolvedValue(1),
              update: jest.fn().mockResolvedValue(true),
              findOneOrFail: jest.fn().mockResolvedValue(outputAdjustment),
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
      ],
    }).compile();

    repository = module.get<MonetaryAdjustmentRepository>(
      MonetaryAdjustmentRepository,
    );
    databaseService = module.get<DatabaseService>(DatabaseService);
    createNotificationService = module.get<CreateNotificationService>(
      CreateNotificationService,
    );
    updateNotificationService = module.get<UpdateNotificationWithoutIdService>(
      UpdateNotificationWithoutIdService,
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

  it('Should create a new adjustment', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      create: jest.fn().mockResolvedValue(outputAdjustment),
      save: jest
        .fn()
        .mockResolvedValueOnce(updateRegister)
        .mockResolvedValueOnce(mockSave),
    });
    await repository.onModuleInit();
    const resp = await repository.createAdjustment(
      adjustmentMetadataDto,
      adjustmentDto,
    );
    expect(resp).toEqual(outputAdjustment);
  });

  it('Should throw new error when trying to create adjustments', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      create: jest.fn().mockResolvedValue(outputAdjustment),
      save: jest
        .fn()
        .mockResolvedValueOnce(updateRegister)
        .mockRejectedValueOnce({
          code: '23502',
        }),
    });
    await repository.onModuleInit();
    await expect(
      repository.createAdjustment(adjustmentMetadataDto, adjustmentDto),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS003,
        'Error al crear el ajuste monetario.',
      ),
    );
  });

  it('Should throw new error when trying to create adjustments with a non code 23502', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      create: jest.fn().mockResolvedValue(outputAdjustment),
      save: jest
        .fn()
        .mockResolvedValueOnce(updateRegister)
        .mockRejectedValueOnce(new Error('Something went wrong')),
    });
    await repository.onModuleInit();
    await expect(
      repository.createAdjustment(adjustmentMetadataDto, adjustmentDto),
    ).rejects.toThrow(
      new InternalServerException(
        ErrorCodesEnum.BOS008,
        'Error inesperado, por favor revisar los logs del servidor.',
      ),
    );
  });
  it('Should throw new error when trying create adjustments with different values', async () => {
    await expect(
      repository.createAdjustment(adjustmentMetadataDto, adjustmentErrorDto),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS003,
        'El monto y la confirmación del monto deben ser iguales.',
      ),
    );
  });
  it('Should find all adjustments of the transaction Level if it exists', async () => {
    const copyAdjustmentMetadata = { ...adjustmentMetadataDto };
    copyAdjustmentMetadata.transactionLevel = 2;
    await repository.onModuleInit();
    const resp = await repository.findAll(
      copyAdjustmentMetadata,
      adjustmentQuery,
    );
    expect(resp).toEqual(getAdjustmentResponseWithPagination);
  });
  it('Should find all adjustments where transactionLevel is 0', async () => {
    const copyAdjustmentMetadata = { ...adjustmentMetadataDto };
    copyAdjustmentMetadata.transactionLevel = 0;
    await repository.onModuleInit();
    const resp = await repository.findAll(
      copyAdjustmentMetadata,
      adjustmentQuery,
    );
    expect(resp).toEqual(getAdjustmentResponseWithPagination);
  });
  it('Should find all adjustments when the queryDto is empty', async () => {
    await repository.onModuleInit();
    const resp = await repository.findAll(
      adjustmentMetadataDto,
      emptyAdjustmentQuery,
    );
    expect(resp).toEqual(getAdjustmentResponseWithPagination);
  });
  it('Should throw an error when trying to find all adjustments', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      find: jest.fn().mockRejectedValue(new Error('Something went wrong')),
      count: jest.fn().mockRejectedValue(new Error('Something went wrong')),
    });
    await repository.onModuleInit();
    await expect(
      repository.findAll(adjustmentMetadataDto, emptyAdjustmentQuery),
    ).rejects.toThrow(
      new NotFoundException(
        ErrorCodesEnum.BOS004,
        'Error al intentar obtener los ajustes monetarios.',
      ),
    );
  });
  it('Should patch the transaction level of one monetary adjustment', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      update: jest.fn().mockResolvedValue(true),
      findOneOrFail: jest
        .fn()
        .mockResolvedValue(findOneAdjustmentWithRelations),
    });
    await repository.onModuleInit();
    const resp = await repository.patchTransactionLevel(
      adjustmentId,
      newTransactionLevel,
      adjustmentMetadataDtoCapturer,
      'anemailtest@test.com',
    );
    expect(resp).toEqual(`Pass to next level ${newTransactionLevel}`);
  });
  it('Should throw an error when trying to patch an adjustments', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      update: jest.fn().mockRejectedValue(new Error('Something went wrong')),
    });
    await repository.onModuleInit();
    await expect(
      repository.patchTransactionLevel(
        adjustmentId,
        newTransactionLevel,
        adjustmentMetadataDtoCapturer,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS006,
        'Error al intentar actualizar el nivel del ajuste monetario.',
      ),
    );
  });
  it('Should patch the state of one monetary adjustment without comment', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      update: jest.fn().mockResolvedValue(true),
      findOne: jest.fn().mockResolvedValue(outputAdjustmentWithRelations),
    });
    await repository.onModuleInit();
    const resp = await repository.patchAdjustmentState(
      adjustmentId,
      newAdjustmentState,
      adjustmentMetadataDtoCapturer,
    );
    expect(resp).toEqual({
      result: true,
    });
  });
  it('Should patch the state of one monetary adjustment with comment', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      update: jest.fn().mockResolvedValue(true),
      findOne: jest.fn().mockResolvedValue(outputAdjustmentWithRelations),
    });
    await repository.onModuleInit();
    const resp = await repository.patchAdjustmentState(
      adjustmentId,
      newAdjustmentState,
      adjustmentMetadataDtoCapturer,
      comment,
    );
    expect(resp).toEqual({
      result: true,
    });
  });
  it('Should throw an error when trying to patch an adjustments', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      update: jest.fn().mockRejectedValue(new Error('Something went wrong')),
    });
    await repository.onModuleInit();
    await expect(
      repository.patchAdjustmentState(
        adjustmentId,
        newAdjustmentState,
        adjustmentMetadataDtoCapturer,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS006,
        'Error al intentar actualizar el estado del ajuste monetario.',
      ),
    );
  });
  it('Should find an adjustment by id', async () => {
    await repository.onModuleInit();
    const resp = await repository.findAdjustmentById(adjustmentId);
    expect(resp).toEqual(outputAdjustment);
  });
  it('Should find an adjustment by id', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      findOneOrFail: jest
        .fn()
        .mockRejectedValue(new Error('Something went wrong')),
    });
    await repository.onModuleInit();
    await expect(repository.findAdjustmentById(adjustmentId)).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS002,
        'El ajuste monetario no fue encontrado.',
      ),
    );
  });

  describe('countAccepted', () => {
    it('should return the number of accepted adjustments', async () => {
      const initDate = new Date(2023, 1, 1);
      const endDate = new Date(2023, 5, 1);
      const expectedCount = 1;
      await repository.onModuleInit();
      const resp = await repository.countAccepted(
        initDate,
        endDate,
        rolesToFind,
      );
      expect(resp).toEqual(expectedCount);
    });
  });

  describe('countFailed', () => {
    it('should return the number of failed adjustments', async () => {
      const initDate = new Date(2023, 1, 1);
      const endDate = new Date(2023, 5, 1);
      const expectedCount = 1;
      await repository.onModuleInit();
      const resp = await repository.countFailed(initDate, endDate, rolesToFind);
      expect(resp).toEqual(expectedCount);
    });
  });
});
