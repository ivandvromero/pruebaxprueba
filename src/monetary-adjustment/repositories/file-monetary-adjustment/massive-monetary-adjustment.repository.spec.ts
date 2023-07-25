import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@dale/logger-nestjs';
import { MonetaryAdjustmentRepository } from '../monetary-adjustment/monetary-adjustment.repository';
import { TransactionCodeService } from '../../../transaction-codes/services/transaction-codes.service';
import {
  BadRequestException,
  NotFoundException,
} from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import {
  outputAdjustment,
  adjustmentQuery,
  adjustmentId,
  newTransactionLevel,
  newAdjustmentState,
  rejectedAdjustmentState,
  comment,
  failedResponse,
  failedResponsePTS,
  fileMassiveMonetaryAdjustmentsMock,
  okResponse,
  okResponsePTS,
  okWithErrorResponsePTS,
  okWithErrorsResponse,
  adjustmentMetadataDto,
  adjustmentMetadataDtoValidator,
} from '@dale/testcases/dtos-testcases';
import {
  createMassiveAdjustmentResponse,
  adjustmentWithRelations,
  massiveAdjustmentDto,
  massiveAdjustmentResponseWithNewAdjustments,
  firstAdjustment,
  secondAdjustment,
  getAllResponsePaginated,
} from '@dale/testcases/massive-testcases';
import { MassiveMonetaryAdjustmentFileRepository } from './massive-monetary-adjustment-file.repository';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { FindNextUserMassiveMonetaryAdjustmentService } from '@dale/monetary-adjustment/modules/monetary-adjustment/service/find-next-user-massive-monetary-adjustment.service';
import { CreateNotificationService } from '@dale/notifications/services/create-notification.service';
import { UpdateNotificationWithoutIdService } from '@dale/notifications/services/update-notification-date-without-id.service';

describe('Monetary Adjustment Repository Testing', () => {
  let repository: MassiveMonetaryAdjustmentFileRepository;
  let singleAdjustmentRepository: MonetaryAdjustmentRepository;
  let databaseService: DatabaseService;
  let transactionCodeService: TransactionCodeService;
  let findNextUserMassiveService: FindNextUserMassiveMonetaryAdjustmentService;
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
        MassiveMonetaryAdjustmentFileRepository,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: mockSave,
              create: jest
                .fn()
                .mockResolvedValue(createMassiveAdjustmentResponse),
              find: jest
                .fn()
                .mockResolvedValue([createMassiveAdjustmentResponse]),
              count: jest.fn().mockResolvedValue(1),
              update: jest.fn().mockResolvedValue(true),
              findOne: jest
                .fn()
                .mockResolvedValue(createMassiveAdjustmentResponse),
              findOneOrFail: jest
                .fn()
                .mockResolvedValue(adjustmentWithRelations),
            })),
            isDbConnectionAlive: jest.fn(() => true),
            queryRunner: {
              connect: jest.fn().mockResolvedValue(true),
              startTransaction: jest.fn().mockResolvedValue(true),
              manager: {
                save: jest
                  .fn()
                  .mockResolvedValue(createMassiveAdjustmentResponse),
              },
              commitTransaction: jest.fn().mockResolvedValue(true),
              rollbackTransaction: jest.fn().mockResolvedValue(true),
              release: jest.fn().mockResolvedValue(true),
            },
          }),
        },
        {
          provide: TransactionCodeService,
          useValue: {
            getDescriptionCode: jest
              .fn()
              .mockImplementation(() => Promise.resolve('a description code')),
            getRolesByCode: jest.fn(() => true),
          },
        },
        {
          provide: FindNextUserMassiveMonetaryAdjustmentService,
          useValue: {
            run: jest.fn(),
          },
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

    repository = module.get<MassiveMonetaryAdjustmentFileRepository>(
      MassiveMonetaryAdjustmentFileRepository,
    );
    singleAdjustmentRepository = module.get<MonetaryAdjustmentRepository>(
      MonetaryAdjustmentRepository,
    );
    databaseService = module.get<DatabaseService>(DatabaseService);
    transactionCodeService = module.get<TransactionCodeService>(
      TransactionCodeService,
    );
    findNextUserMassiveService =
      module.get<FindNextUserMassiveMonetaryAdjustmentService>(
        FindNextUserMassiveMonetaryAdjustmentService,
      );
    createNotificationService = module.get<CreateNotificationService>(
      CreateNotificationService,
    );
    updateNotificationService = module.get<UpdateNotificationWithoutIdService>(
      UpdateNotificationWithoutIdService,
    );
  });

  it('Should be repository defined', () => {
    expect(repository).toBeDefined();
    expect(singleAdjustmentRepository).toBeDefined();
    expect(databaseService).toBeDefined();
    expect(transactionCodeService).toBeDefined();
    expect(findNextUserMassiveService).toBeDefined();
    expect(createNotificationService).toBeDefined();
    expect(updateNotificationService).toBeDefined();
  });

  it('should return true when isDbConnectionAlive function get called', async () => {
    const result = await repository.isDbConnectionAlive();
    expect(result).toBe(true);
  });

  it('Should create a new adjustment', async () => {
    const connectSpy = jest.spyOn(databaseService.queryRunner, 'connect');
    const startTransactionSpy = jest.spyOn(
      databaseService.queryRunner,
      'startTransaction',
    );
    const saveSpy = jest.spyOn(databaseService.queryRunner.manager, 'save');

    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      save: jest.fn().mockResolvedValueOnce(createMassiveAdjustmentResponse),
      findOne: jest.fn().mockResolvedValue(createMassiveAdjustmentResponse),
    });

    const commitTransactionSpy = jest.spyOn(
      databaseService.queryRunner,
      'commitTransaction',
    );
    const rollbackTransactionSpy = jest.spyOn(
      databaseService.queryRunner,
      'rollbackTransaction',
    );
    await repository.onModuleInit();
    const resp = await repository.createMassiveAdjustments(
      massiveAdjustmentDto,
      adjustmentMetadataDto,
    );
    expect(resp).toEqual(createMassiveAdjustmentResponse);
    expect(connectSpy).toBeCalledTimes(1);
    expect(startTransactionSpy).toBeCalledTimes(1);
    expect(saveSpy).toBeCalledTimes(2);
    expect(commitTransactionSpy).toBeCalledTimes(1);
    expect(rollbackTransactionSpy).toBeCalledTimes(0);
  });

  it('Should update an adjustment when already exists in db', async () => {
    const connectSpy = jest.spyOn(databaseService.queryRunner, 'connect');
    const startTransactionSpy = jest.spyOn(
      databaseService.queryRunner,
      'startTransaction',
    );
    const saveSpy = jest
      .spyOn(databaseService.queryRunner.manager, 'save')
      .mockResolvedValueOnce(createMassiveAdjustmentResponse)
      .mockRejectedValueOnce({ code: '23505' });
    const commitTransactionSpy = jest.spyOn(
      databaseService.queryRunner,
      'commitTransaction',
    );
    const rollbackTransactionSpy = jest.spyOn(
      databaseService.queryRunner,
      'rollbackTransaction',
    );
    const releaseSpy = jest.spyOn(databaseService.queryRunner, 'release');

    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(createMassiveAdjustmentResponse)
        .mockResolvedValueOnce(massiveAdjustmentResponseWithNewAdjustments),
      create: jest
        .fn()
        .mockResolvedValue(createMassiveAdjustmentResponse)
        .mockResolvedValueOnce(firstAdjustment)
        .mockResolvedValueOnce(secondAdjustment),
      findOneOrFail: jest.fn().mockResolvedValue(adjustmentWithRelations),
      save: jest
        .fn()
        .mockResolvedValueOnce(firstAdjustment)
        .mockResolvedValueOnce(secondAdjustment)
        .mockResolvedValue(massiveAdjustmentResponseWithNewAdjustments),
    });

    await repository.onModuleInit();
    const resp = await repository.createMassiveAdjustments(
      massiveAdjustmentDto,
      adjustmentMetadataDto,
    );
    expect(resp).toEqual(massiveAdjustmentResponseWithNewAdjustments);
    expect(connectSpy).toBeCalledTimes(1);
    expect(startTransactionSpy).toBeCalledTimes(1);
    expect(saveSpy).toBeCalledTimes(2);
    expect(commitTransactionSpy).toBeCalledTimes(0);
    expect(rollbackTransactionSpy).toBeCalledTimes(1);
    expect(releaseSpy).toBeCalledTimes(1);
  });

  it('Should throw an error when trying to add adjustment when trying to add new adjustments', async () => {
    const connectSpy = jest.spyOn(databaseService.queryRunner, 'connect');

    const saveSpy = jest
      .spyOn(databaseService.queryRunner.manager, 'save')
      .mockResolvedValueOnce(createMassiveAdjustmentResponse)
      .mockRejectedValueOnce({ code: '23505' });

    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      findOne: jest
        .fn()
        .mockResolvedValueOnce(createMassiveAdjustmentResponse)
        .mockResolvedValueOnce(massiveAdjustmentResponseWithNewAdjustments),
      create: jest
        .fn()
        .mockResolvedValue(createMassiveAdjustmentResponse)
        .mockResolvedValueOnce(firstAdjustment)
        .mockResolvedValueOnce(secondAdjustment),
      findOneOrFail: jest.fn().mockResolvedValue(adjustmentWithRelations),
      save: jest
        .fn()
        .mockRejectedValueOnce({
          code: '23505',
        })
        .mockRejectedValueOnce(new Error('Something went wrong')),
    });

    await repository.onModuleInit();
    await expect(
      repository.createMassiveAdjustments(
        massiveAdjustmentDto,
        adjustmentMetadataDto,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS016,
        'Error al intentar crear ajustes individuales',
      ),
    );
    expect(connectSpy).toBeCalledTimes(1);
    expect(saveSpy).toBeCalledTimes(2);
  });

  it('Should throw a non handled error when trying to create a new adjustment', async () => {
    jest
      .spyOn(databaseService.queryRunner.manager, 'save')
      .mockRejectedValue(new Error());

    await repository.onModuleInit();

    await expect(
      repository.createMassiveAdjustments(
        massiveAdjustmentDto,
        adjustmentMetadataDto,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS013,
        'Error al crear el ajuste monetario masivo.',
      ),
    );
  });

  it('Should find all massive adjustments', async () => {
    await repository.onModuleInit();
    const resp = await repository.findAllMassiveAdjustment(
      adjustmentMetadataDto,
      adjustmentQuery,
    );
    expect(resp).toEqual(getAllResponsePaginated);
  });

  it('Should throw a non handled error when searching massive adjustments', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      find: jest.fn().mockRejectedValueOnce(new Error('Something went wrong')),
    });
    await repository.onModuleInit();
    await expect(
      repository.findAllMassiveAdjustment(
        adjustmentMetadataDto,
        adjustmentQuery,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS015,
        'Error al buscar los ajustes masivos',
      ),
    );
  });

  it('Should find all massive adjustments pending of transactionLevel 1 ', async () => {
    await repository.onModuleInit();
    const resp = await repository.findAllMassiveAdjustment(
      adjustmentMetadataDtoValidator,
      {},
    );
    expect(resp).toEqual(getAllResponsePaginated);
  });

  it('Should patch the transaction level of one monetary adjustment', async () => {
    await repository.onModuleInit();
    const resp = await repository.patchTransactionLevel(
      adjustmentId,
      newTransactionLevel,
      adjustmentMetadataDto,
    );
    expect(resp).toEqual(`Pass to next level ${newTransactionLevel}`);
  });

  it('Should throw a non handled error when patching level of one monetary adjustment', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      update: jest
        .fn()
        .mockRejectedValueOnce(new Error('Something went wrong')),
      findOne: jest.fn().mockResolvedValue(createMassiveAdjustmentResponse),
    });
    await repository.onModuleInit();
    await expect(
      repository.patchTransactionLevel(
        adjustmentId,
        newTransactionLevel,
        adjustmentMetadataDto,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS009,
        'Error al intentar actualizar el nivel del archivo del ajuste masivo',
      ),
    );
  });

  it('Should patch the state of one monetary adjustment without comment', async () => {
    await repository.onModuleInit();
    const resp = await repository.patchAdjustmentState(
      adjustmentId,
      newAdjustmentState,
      adjustmentMetadataDtoValidator,
    );
    expect(resp).toEqual({
      result: true,
    });
  });

  it('Should patch the state of one monetary adjustment with comment', async () => {
    await repository.onModuleInit();
    const resp = await repository.patchAdjustmentState(
      adjustmentId,
      rejectedAdjustmentState,
      adjustmentMetadataDtoValidator,
      comment,
    );
    expect(resp).toEqual({
      result: true,
    });
  });

  it('Should throw a non handled error when patching level of one monetary adjustment', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      update: jest
        .fn()
        .mockRejectedValueOnce(new Error('Something went wrong')),
      findOne: jest.fn().mockResolvedValue(createMassiveAdjustmentResponse),
    });
    await repository.onModuleInit();
    await expect(
      repository.patchAdjustmentState(
        adjustmentId,
        rejectedAdjustmentState,
        adjustmentMetadataDtoValidator,
        comment,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS009,
        'Error al intentar actualizar el nivel del archivo del ajuste masivo',
      ),
    );
  });

  it('Should patch the state of one file monetary adjustment to accepted ', async () => {
    await repository.onModuleInit();
    await repository.reprocessAdjustmentState(adjustmentId, true);
    const repoSpy = jest.spyOn(databaseService, 'getRepository');
    expect(repoSpy).toBeCalledTimes(3);
  });

  it('Should return an object of UpdateSingleAdjustmentsResponse type ', async () => {
    await repository.onModuleInit();
    const { adjustments } = fileMassiveMonetaryAdjustmentsMock;

    const resp = await repository.updateSingleAdjustmentsFromFile(
      okResponsePTS,
      adjustments,
    );
    expect(resp).toStrictEqual(okResponse);
  });
  it('Should return an object of UpdateSingleAdjustmentsResponse type ', async () => {
    await repository.onModuleInit();
    const { adjustments } = fileMassiveMonetaryAdjustmentsMock;

    const resp = await repository.updateSingleAdjustmentsFromFile(
      okWithErrorResponsePTS,
      adjustments,
    );
    expect(resp).toStrictEqual(okWithErrorsResponse);
  });
  it('Should return an object of UpdateSingleAdjustmentsResponse type ', async () => {
    await repository.onModuleInit();
    const { adjustments } = fileMassiveMonetaryAdjustmentsMock;

    const resp = await repository.updateSingleAdjustmentsFromFile(
      failedResponsePTS,
      adjustments,
    );
    expect(resp).toStrictEqual(failedResponse);
  });

  it('Should throw a non handled error when patching one file monetary adjustment to accepted ', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      update: jest
        .fn()
        .mockRejectedValueOnce(new Error('Something went wrong')),
    });
    await repository.onModuleInit();
    await expect(
      repository.reprocessAdjustmentState(adjustmentId, true),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS009,
        'Error al intentar actualizar el nivel del archivo del ajuste masivo',
      ),
    );
  });

  it('Should patch the state of one single adjustment', async () => {
    await repository.onModuleInit();
    await repository.patchSingleAdjustment(
      adjustmentId,
      comment,
      null,
      newAdjustmentState,
    );
    const repoSpy = jest.spyOn(databaseService, 'getRepository');
    expect(repoSpy).toBeCalledTimes(3);
  });

  it('Should throw a non handled error when patching the state of one single adjustment', async () => {
    jest.spyOn(databaseService, 'getRepository').mockReturnValue({
      update: jest
        .fn()
        .mockRejectedValueOnce(new Error('Something went wrong')),
    });
    await repository.onModuleInit();
    await expect(
      repository.patchSingleAdjustment(
        adjustmentId,
        comment,
        null,
        newAdjustmentState,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS009,
        'Error al intentar actualizar el archivo del ajuste masivo',
      ),
    );
  });

  describe('getOneMassive', () => {
    it('should throw a NotFoundException if the adjustment file is not found', async () => {
      jest.spyOn(databaseService, 'getRepository').mockReturnValue({
        findOne: jest
          .fn()
          .mockRejectedValueOnce(new Error('Something went wrong')),
      });
      try {
        await repository.onModuleInit();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          'No se ha encontrado el ajuste monetario',
        );
        expect(error.code).toEqual(ErrorCodesEnum.BOS012);
      }
    });

    it('should return the file adjustments', async () => {
      await repository.onModuleInit();
      const id = '1233554488';
      const relations = true;
      const resp = await repository.getOneMassive(id, relations);
      expect(resp).toEqual(createMassiveAdjustmentResponse);
    });
  });
});
