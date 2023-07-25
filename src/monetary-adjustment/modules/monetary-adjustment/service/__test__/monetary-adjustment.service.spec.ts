import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import * as ExcelJs from 'exceljs';
import { TransactionService } from '@dale/client/modules/services/transaction.service';
import {
  outputAdjustment,
  getAdjustmentResponse,
  rejectResponseInterface,
  fileMassiveMonetaryAdjustmentsMock,
  newTransactionLevel,
  responseInterface,
  adjustmentDto,
  adjustmentQuery,
  adjustmentId,
  newAdjustmentState,
  adjustmentApproved,
  adjustmentRejected,
  massiveAdjustmentId,
  workbookMock,
  getAdjustmentResponseWithPagination,
  mockGetAdjustmentQueryReportsDto,
  adjustmentMetadataDto,
  adjustmentMetadataDtoValidator,
  rolesToFind,
} from '@dale/testcases/dtos-testcases';
import {
  createMassiveAdjustmentResponse,
  getAllResponsePaginated,
  getReportsPaginated,
  massiveAdjustmentDto,
  failedMassiveAdjustmentResponse,
  searchQuery,
} from '@dale/testcases/massive-testcases';
import { AdjustmentsRegisterRepository } from '@dale/monetary-adjustment/repositories/activity-update/adjustment-registrer.repository';
import { MassiveMonetaryAdjustmentFileRepository } from '@dale/monetary-adjustment/repositories/file-monetary-adjustment/massive-monetary-adjustment-file.repository';
import { MonetaryAdjustmentRepository } from '@dale/monetary-adjustment/repositories/monetary-adjustment/monetary-adjustment.repository';
import { TransactionDispatch } from '../../chain-handlers/handlers/transaction-dispatch';
import { TransactionLevel } from '../../chain-handlers/handlers/transaction-level';
import { MassiveTransactionDispatch } from '../../chain-handlers/massive handlers/massive-transaction-dispatch';
import { MassiveTransactionLevel } from '../../chain-handlers/massive handlers/massive-transaction-level';
import { AdjustmentStateDto } from '../../dto';
import { MonetaryAdjustmentService } from '../monetary-adjustment.service';
import { UseWorkBalancerService } from '@dale/user-work-balancer/modules/services/use-work-balancer.service';
import { FindNextUserSingleMonetaryAdjustmentService } from '../find-next-user-single-monetary-adjustment.service';
import { CreateNotificationService } from '@dale/notifications/services/create-notification.service';
import { UpdateNotificationWithoutIdService } from '@dale/notifications/services/update-notification-date-without-id.service';

describe('MonetaryAdjustmentService', () => {
  let service: MonetaryAdjustmentService;
  let repository: MonetaryAdjustmentRepository;
  let repositoryMassive: MassiveMonetaryAdjustmentFileRepository;
  let logger: Logger;
  let transactionLevel: TransactionLevel;
  let transactionDispatch: TransactionDispatch;
  let massiveTransactionLevel: MassiveTransactionLevel;
  let massiveTransactionDispatch: MassiveTransactionDispatch;
  let transactionService: TransactionService;
  let findNextUserService: FindNextUserSingleMonetaryAdjustmentService;
  let createNotificationService: CreateNotificationService;
  let updateNotificationService: UpdateNotificationWithoutIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonetaryAdjustmentService,
        TransactionLevel,
        TransactionDispatch,
        MassiveTransactionLevel,
        MassiveTransactionDispatch,
        {
          provide: TransactionService,
          useValue: {
            sendTransaction: jest.fn(() => {
              return Promise.resolve(true);
            }),
          },
        },
        {
          provide: FindNextUserSingleMonetaryAdjustmentService,
          useValue: {
            run: jest.fn(),
          },
        },
        {
          provide: UseWorkBalancerService,
          useValue: {
            getRandomEmail: jest.fn(() => {
              return Promise.resolve('backoffice-validator@yopmail.com');
            }),
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
        {
          provide: MonetaryAdjustmentRepository,
          useValue: {
            createAdjustment: jest.fn(() => {
              return Promise.resolve(outputAdjustment);
            }),
            findAll: jest.fn().mockResolvedValue([getAdjustmentResponse]),
            patchTransactionLevel: jest.fn(
              (adjustmentId: string, newTransactionLevel: number) => {
                return Promise.resolve(
                  `Pass to next level ${newTransactionLevel}`,
                );
              },
            ),
            patchAdjustmentState: jest.fn(() => {
              return rejectResponseInterface;
            }),
            findAdjustmentById: jest.fn(() => {
              return Promise.resolve(outputAdjustment);
            }),
            countAccepted: jest.fn(() => {
              return Promise.resolve(2);
            }),
            countFailed: jest.fn(() => {
              return Promise.resolve(1);
            }),
            countPendingIndividual: jest.fn(() => {
              return Promise.resolve(2);
            }),
            countPendingMassive: jest.fn(() => {
              return Promise.resolve(1);
            }),
          },
        },
        {
          provide: MassiveMonetaryAdjustmentFileRepository,
          useValue: {
            getOneMassive: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(fileMassiveMonetaryAdjustmentsMock),
              ),
            createMassiveAdjustments: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(createMassiveAdjustmentResponse),
              ),
            findAllMassiveAdjustment: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(getAllResponsePaginated),
              ),
            patchTransactionLevel: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(`Pass to next level ${newTransactionLevel}`),
              ),
            patchAdjustmentState: jest.fn(() => {
              return rejectResponseInterface;
            }),
            patchSingleAdjustment: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
            updateSingleAdjustmentsFromFile: jest.fn(() => {
              return { hasError: false, notAccepted: false };
            }),
            reprocessAdjustmentState: jest
              .fn()
              .mockImplementation(() => Promise.resolve()),
          },
        },
        {
          provide: AdjustmentsRegisterRepository,
          useValue: {
            findAll: jest
              .fn()
              .mockImplementation(() => Promise.resolve(getReportsPaginated)),
          },
        },
        {
          provide: TransactionLevel,
          useValue: {
            handle: jest.fn().mockResolvedValue(responseInterface),
          },
        },
        {
          provide: TransactionDispatch,
          useValue: {
            handle: jest.fn().mockResolvedValue(responseInterface),
          },
        },
        {
          provide: MassiveTransactionLevel,
          useValue: {
            handle: jest.fn().mockResolvedValue(responseInterface),
          },
        },
        {
          provide: MassiveTransactionDispatch,
          useValue: {
            handle: jest.fn().mockResolvedValue(responseInterface),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MonetaryAdjustmentService>(MonetaryAdjustmentService);
    repository = module.get<MonetaryAdjustmentRepository>(
      MonetaryAdjustmentRepository,
    );
    repositoryMassive = module.get<MassiveMonetaryAdjustmentFileRepository>(
      MassiveMonetaryAdjustmentFileRepository,
    );
    logger = module.get<Logger>(Logger);
    transactionLevel = module.get<TransactionLevel>(TransactionLevel);
    transactionDispatch = module.get<TransactionDispatch>(TransactionDispatch);
    massiveTransactionLevel = module.get<MassiveTransactionLevel>(
      MassiveTransactionLevel,
    );
    massiveTransactionDispatch = module.get<MassiveTransactionDispatch>(
      MassiveTransactionDispatch,
    );
    transactionService = module.get<TransactionService>(TransactionService);
    findNextUserService =
      module.get<FindNextUserSingleMonetaryAdjustmentService>(
        FindNextUserSingleMonetaryAdjustmentService,
      );
    createNotificationService = module.get<CreateNotificationService>(
      CreateNotificationService,
    );
    updateNotificationService = module.get<UpdateNotificationWithoutIdService>(
      UpdateNotificationWithoutIdService,
    );
  });

  it('Should be service and repository defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(repositoryMassive).toBeDefined();
    expect(logger).toBeDefined();
    expect(transactionLevel).toBeDefined();
    expect(transactionDispatch).toBeDefined();
    expect(massiveTransactionLevel).toBeDefined();
    expect(massiveTransactionDispatch).toBeDefined();
    expect(transactionService).toBeDefined();
    expect(findNextUserService).toBeDefined();
    expect(createNotificationService).toBeDefined();
    expect(updateNotificationService).toBeDefined();
  });

  it('Should create a new adjustment', async () => {
    //Arrange
    //! This variable is adjustmentDto

    //Act
    const repositorySpy = jest.spyOn(repository, 'createAdjustment');
    const resp = await service.createAdjustment(
      adjustmentMetadataDto,
      adjustmentDto,
    );

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(outputAdjustment);
  });

  it('Should find all adjustment', () => {
    //Arrange
    //! This variable is adjustmentDto

    //Act
    const resp = service.findAll(adjustmentMetadataDto, adjustmentQuery);
    const repositorySpy = jest.spyOn(repository, 'findAll');

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toBeInstanceOf(Array);
  });
  it('Should patch the transaction level of an adjustment', () => {
    //Arrange
    //! This variable is adjustmentDto

    //Act
    const resp = service.patchTransactionLevel(
      adjustmentId,
      newTransactionLevel,
      adjustmentMetadataDto,
    );
    const repositorySpy = jest.spyOn(repository, 'patchTransactionLevel');

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(`Pass to next level ${newTransactionLevel}`);
  });
  it('Should patch the state of an adjustment', () => {
    //Arrange
    //! This variable is adjustmentDto

    //Act
    const resp = service.patchAdjustmentState(
      adjustmentId,
      newAdjustmentState,
      adjustmentMetadataDto,
    );
    const repositorySpy = jest.spyOn(repository, 'patchAdjustmentState');

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(rejectResponseInterface);
  });
  it('Should find an adjustment by id', () => {
    //Arrange

    //Act
    const resp = service.findAdjustmentById(adjustmentId);
    const repositorySpy = jest.spyOn(repository, 'findAdjustmentById');

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputAdjustment);
  });
  it('Should validate an approved adjustment', async () => {
    //Arrange

    //Act
    const resp = await service.adjustmentValidations(
      adjustmentId,
      adjustmentApproved,
      1,
      adjustmentMetadataDto,
    );

    const repositorySpyPatch = jest.spyOn(repository, 'patchAdjustmentState');
    const chainHandlerLevelSpy = jest.spyOn(transactionLevel, 'handle');
    const chainHandlerDispatchSpy = jest.spyOn(transactionDispatch, 'handle');

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpyPatch).toBeCalledTimes(0);
    expect(chainHandlerLevelSpy).toBeCalledTimes(1);
    expect(chainHandlerDispatchSpy).toBeCalledTimes(1);

    expect(resp).toEqual(responseInterface);
  });
  it('Should validate an approved adjustment and dispatch to PTS', async () => {
    //Arrange

    //Act
    const repositorySpyPatch = jest.spyOn(repository, 'patchAdjustmentState');
    const chainHandlerLevelSpy = jest
      .spyOn(transactionLevel, 'handle')
      .mockResolvedValue(null);
    const chainHandlerDispatchSpy = jest.spyOn(transactionDispatch, 'handle');

    const resp = await service.adjustmentValidations(
      adjustmentId,
      adjustmentApproved,
      2,
      adjustmentMetadataDto,
    );

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpyPatch).toBeCalledTimes(0);
    expect(chainHandlerLevelSpy).toBeCalledTimes(1);
    expect(chainHandlerDispatchSpy).toBeCalledTimes(1);

    expect(resp).toEqual(responseInterface);
  });
  it('Should validate an rejected adjustment', () => {
    //Arrange

    //Act
    const resp = service.adjustmentValidations(
      adjustmentId,
      adjustmentRejected,
      1,
      adjustmentMetadataDto,
    );
    const repositorySpyPatch = jest.spyOn(repository, 'patchAdjustmentState');

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpyPatch).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(rejectResponseInterface);
  });

  describe('Massive adjustments ', () => {
    it('should get the massive monetary tightening', async () => {
      const resp = await service.getMassiveMonetaryAdjustment(
        massiveAdjustmentId,
      );

      expect(resp).toEqual(fileMassiveMonetaryAdjustmentsMock);
    });

    it('should rebuild the excel file', async () => {
      const id = 'a1234';
      const log = 'true';
      const resp = await service.createArchive(id, log);
      expect(resp).toBeInstanceOf(Uint8Array);

      expect(ExcelJs.Workbook).toHaveBeenCalled();
      expect(workbookMock.addWorksheet).toHaveBeenCalledWith('archivo.xlsx');
      expect(workbookMock.xlsx.writeBuffer).toHaveBeenCalled();
    });

    it('should return formatted name', async () => {
      const resp = await service.getFormattedName(massiveAdjustmentId);
      expect(resp).toEqual('archivo.xlsx');
    });
    it('Should create a new massive adjustment', () => {
      const resp = service.createMassiveAdjustment(
        massiveAdjustmentDto,
        adjustmentMetadataDto,
      );
      const repositorySpy = jest.spyOn(
        repositoryMassive,
        'createMassiveAdjustments',
      );
      expect(resp).toBeDefined();
      expect(repositorySpy).toBeCalledTimes(1);
      expect(resp).resolves.toEqual(createMassiveAdjustmentResponse);
    });
    it('Should find all massive adjustments', () => {
      const resp = service.findAllMassiveAdjustment(
        adjustmentMetadataDtoValidator,
        adjustmentQuery,
      );
      const repositorySpy = jest.spyOn(
        repositoryMassive,
        'findAllMassiveAdjustment',
      );

      expect(resp).toBeDefined();
      expect(repositorySpy).toBeCalledTimes(1);

      expect(resp).resolves.toEqual(getAllResponsePaginated);
    });
    it('Should patch the state of an adjustment', async () => {
      const repositorySpyGet = jest
        .spyOn(repositoryMassive, 'getOneMassive')
        .mockResolvedValueOnce(fileMassiveMonetaryAdjustmentsMock);

      const patchSingleAdjustmentSpy = jest.spyOn(
        repositoryMassive,
        'patchSingleAdjustment',
      );

      const patchAdjustmentStateSpy = jest.spyOn(
        repositoryMassive,
        'patchAdjustmentState',
      );

      const resp = await service.patchMassiveAdjustmentState(
        adjustmentId,
        newAdjustmentState,
        adjustmentMetadataDto,
      );

      expect(resp).toBeDefined();
      expect(repositorySpyGet).toBeCalledTimes(1);
      expect(patchSingleAdjustmentSpy).toBeCalled();
      expect(patchAdjustmentStateSpy).toBeCalledTimes(1);
      expect(resp).toEqual(rejectResponseInterface);
    });
    it('Should validate an approved massive adjustments', async () => {
      const resp = await service.adjustmentFiletValidations(
        adjustmentId,
        adjustmentApproved,
        1,
        adjustmentMetadataDto,
      );
      const repositorySpyPatch = jest.spyOn(
        repositoryMassive,
        'patchAdjustmentState',
      );
      const chainHandlerLevelSpy = jest.spyOn(
        massiveTransactionLevel,
        'handle',
      );
      const chainHandlerDispatchSpy = jest.spyOn(
        massiveTransactionDispatch,
        'handle',
      );
      const dispatchServiceSpy = jest.spyOn(
        massiveTransactionDispatch,
        'handle',
      );

      expect(resp).toBeDefined();
      expect(repositorySpyPatch).toBeCalledTimes(0);
      expect(chainHandlerLevelSpy).toBeCalledTimes(1);
      expect(chainHandlerDispatchSpy).toBeCalledTimes(1);
      expect(dispatchServiceSpy).toBeCalledTimes(1);

      expect(resp).toEqual(responseInterface);
    });
    it('Should validate an approved adjustment and dispatch to PTS', async () => {
      const repositorySpyPatch = jest.spyOn(
        repositoryMassive,
        'patchAdjustmentState',
      );
      const chainHandlerLevelSpy = jest
        .spyOn(massiveTransactionLevel, 'handle')
        .mockResolvedValue(null);

      const chainHandlerDispatchSpy = jest.spyOn(
        massiveTransactionLevel,
        'handle',
      );

      const resp = await service.adjustmentFiletValidations(
        adjustmentId,
        adjustmentApproved,
        2,
        adjustmentMetadataDto,
      );

      expect(resp).toBeDefined();
      expect(repositorySpyPatch).toBeCalledTimes(0);
      expect(chainHandlerLevelSpy).toBeCalledTimes(1);
      expect(chainHandlerDispatchSpy).toBeCalledTimes(1);

      expect(resp).toEqual(responseInterface);
    });
    it('Should validate an rejected massive adjustments', () => {
      const repositorySpyPatchGetOne = jest.spyOn(
        repositoryMassive,
        'getOneMassive',
      );
      const serviceSpyPatch = jest.spyOn(
        service,
        'patchMassiveAdjustmentState',
      );
      const resp = service.adjustmentFiletValidations(
        adjustmentId,
        adjustmentRejected,
        1,
        adjustmentMetadataDto,
      );

      expect(resp).toBeDefined();
      expect(serviceSpyPatch).toBeCalledTimes(1);
      expect(repositorySpyPatchGetOne).toBeCalledTimes(1);

      expect(resp).resolves.toEqual(rejectResponseInterface);
    });
    it('Should reprocess a file with certain id successfully', async () => {
      const repositorySpyGet = jest
        .spyOn(repositoryMassive, 'getOneMassive')
        .mockResolvedValueOnce(failedMassiveAdjustmentResponse);
      const repositorySpyPatchSingle = jest.spyOn(
        repositoryMassive,
        'patchSingleAdjustment',
      );
      const transactionServiceSpy = jest.spyOn(
        transactionService,
        'sendTransaction',
      );

      await service.reprocessFile(adjustmentId);
      expect(repositorySpyGet).toBeCalledTimes(1);
      expect(transactionServiceSpy).toBeCalledTimes(1);
      expect(repositorySpyPatchSingle).toBeCalledTimes(0);
    });
    it('Should throw an error if the file has no failed status', async () => {
      const repositorySpyGet = jest
        .spyOn(repositoryMassive, 'getOneMassive')
        .mockResolvedValue(createMassiveAdjustmentResponse);

      const repositorySpyPatchSingle = jest.spyOn(
        repositoryMassive,
        'patchSingleAdjustment',
      );
      const repositorySpyPatchFile = jest.spyOn(
        repositoryMassive,
        'reprocessAdjustmentState',
      );
      const transactionServiceSpy = jest.spyOn(
        transactionService,
        'sendTransaction',
      );

      await service.reprocessFile(adjustmentId);
      expect(repositorySpyGet).toBeCalledTimes(1);
      expect(transactionServiceSpy).toBeCalledTimes(0);
      expect(repositorySpyPatchSingle).toBeCalledTimes(0);
      expect(repositorySpyPatchFile).toBeCalledTimes(0);
    });
  });
  describe('getAdjustmentState', () => {
    it('should return an AdjustmentStateDto object with approved and rejected counts', async () => {
      const expected: AdjustmentStateDto = {
        approved: 2,
        rejected: 1,
      };
      const result = await service.getAdjustmentState(rolesToFind);
      expect(result.approved).toBe(expected.approved);
      expect(result.rejected).toBe(expected.rejected);
    });
  });

  describe('countPendingIndividual', () => {
    it('should return a number of pending individuals', async () => {
      service.findAll = jest
        .fn()
        .mockResolvedValue(getAdjustmentResponseWithPagination);
      const resp = service.countPendingIndividual(
        adjustmentMetadataDto,
        adjustmentQuery,
      );
      expect(resp).toBeDefined();
    });
  });

  describe('countPendingMassive', () => {
    it('should return a number of pending massive', async () => {
      service.findAllMassiveAdjustment = jest
        .fn()
        .mockResolvedValue(getAllResponsePaginated);
      const result = await service.countPendingMassive(
        adjustmentMetadataDtoValidator,
        adjustmentQuery,
      );
      expect(result).toBeDefined();
    });
  });

  describe('Adjustments report', () => {
    it('should return paginated adjustments that meet the dto conditions ', async () => {
      const result = await service.adjustmentReports(searchQuery);
      expect(result).toBeDefined();
      expect(result).toBe(getReportsPaginated);
    });
  });

  it('should rebuild the excel file reports', async () => {
    const resp = await service.generateArchiveReport(
      mockGetAdjustmentQueryReportsDto,
    );
    expect(resp).toBeInstanceOf(Uint8Array);

    expect(ExcelJs.Workbook).toHaveBeenCalled();
    expect(workbookMock.addWorksheet).toHaveBeenCalledWith('NombreArchivo');
    expect(workbookMock.xlsx.writeBuffer).toHaveBeenCalled();
  });
});
