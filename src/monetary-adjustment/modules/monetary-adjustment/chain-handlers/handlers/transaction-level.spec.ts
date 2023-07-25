import { Test, TestingModule } from '@nestjs/testing';
import { MonetaryAdjustmentRepository } from '../../../../repositories/monetary-adjustment/monetary-adjustment.repository';
import { TransactionLevel } from './transaction-level';
import { Logger } from '@dale/logger-nestjs';
import {
  responseInterface,
  adjustmentId,
  newTransactionLevel,
  adjustmentMetadataDtoValidator,
  outputAdjustment,
} from '@dale/testcases/dtos-testcases';
import { FindNextUserSingleMonetaryAdjustmentService } from '../../service/find-next-user-single-monetary-adjustment.service';

describe('TransactionLevel', () => {
  let repository: MonetaryAdjustmentRepository;
  let transactionLevel: TransactionLevel;
  let findNextUserService: FindNextUserSingleMonetaryAdjustmentService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionLevel,

        {
          provide: MonetaryAdjustmentRepository,
          useValue: {
            patchTransactionLevel: jest.fn(() => {
              return responseInterface;
            }),
            findAdjustmentById: jest.fn(() => outputAdjustment),
          },
        },
        {
          provide: FindNextUserSingleMonetaryAdjustmentService,
          useValue: {
            run: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MonetaryAdjustmentRepository>(
      MonetaryAdjustmentRepository,
    );
    logger = module.get<Logger>(Logger);
    transactionLevel = module.get<TransactionLevel>(TransactionLevel);
    findNextUserService =
      module.get<FindNextUserSingleMonetaryAdjustmentService>(
        FindNextUserSingleMonetaryAdjustmentService,
      );
  });

  it('Should be transactionLevel, repository and logger defined', () => {
    expect(repository).toBeDefined();
    expect(transactionLevel).toBeDefined();
    expect(findNextUserService).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should call patchTransactionLevel if the nextLevel exists', async () => {
    //Arrange

    //Act
    const repositorySpy = jest.spyOn(repository, 'patchTransactionLevel');
    const resp = await transactionLevel.handle(
      adjustmentId,
      newTransactionLevel,
      adjustmentMetadataDtoValidator,
    );

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(responseInterface);
  });
  it('Should call the next handler if nextLevel is null and returns null', async () => {
    //Arrange

    //Act
    const transactionLevelSpy = jest.spyOn(transactionLevel, 'handle');
    const repositorySpy = jest.spyOn(repository, 'patchTransactionLevel');
    const resp = await transactionLevel.handle(
      adjustmentId,
      null,
      adjustmentMetadataDtoValidator,
    );

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(0);
    expect(transactionLevelSpy).toBeCalledTimes(1);

    expect(resp).toEqual(null);
  });
});
