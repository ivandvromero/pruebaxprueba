import { Test, TestingModule } from '@nestjs/testing';
import { MonetaryAdjustmentRepository } from '../../../../repositories/monetary-adjustment/monetary-adjustment.repository';
import { Logger } from '@dale/logger-nestjs';
import { TransactionDispatch } from './transaction-dispatch';
import { TransactionService } from '@dale/client/modules/services/transaction.service';
import {
  outputAdjustmentLevel2,
  responseInterface,
  adjustmentId,
  responseInterfaceNull,
  adjustmentMetadataDtoCapturer,
  adjustmentMetadataDtoValidator,
} from '@dale/testcases/dtos-testcases';
import { PtsTokenManager } from '@dale/pts-connector/service/token-manager.service';
import { BadRequestException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

describe('TransactionDispatch', () => {
  let repository: MonetaryAdjustmentRepository;
  let transactionDispatch: TransactionDispatch;
  let transactionService: TransactionService;
  let logger: Logger;
  let ptsTokenManager: PtsTokenManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionDispatch,
        {
          provide: TransactionService,
          useValue: {
            sendTransaction: jest.fn(() => {
              return Promise.resolve(true);
            }),
          },
        },
        {
          provide: MonetaryAdjustmentRepository,
          useValue: {
            findAdjustmentById: jest.fn(() => {
              return Promise.resolve(outputAdjustmentLevel2);
            }),
            patchTransactionLevel: jest.fn(() => {
              return responseInterface;
            }),
            patchAdjustmentState: jest.fn(() => {
              return responseInterface;
            }),
          },
        },
        {
          provide: PtsTokenManager,
          useValue: {
            deleteTokenCache: jest.fn(() => {
              return Promise.resolve();
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MonetaryAdjustmentRepository>(
      MonetaryAdjustmentRepository,
    );
    logger = module.get<Logger>(Logger);
    transactionDispatch = module.get<TransactionDispatch>(TransactionDispatch);
    transactionService = module.get<TransactionService>(TransactionService);
    ptsTokenManager = module.get<PtsTokenManager>(PtsTokenManager);
  });

  it('Should be transactionDispatch, repository and logger defined', () => {
    expect(repository).toBeDefined();
    expect(transactionDispatch).toBeDefined();
    expect(transactionService).toBeDefined();
    expect(logger).toBeDefined();
    expect(ptsTokenManager).toBeDefined();
  });

  it('Should call patchTransactionLevel if the nextLevel exists', async () => {
    //Arrange

    //Act
    const resp = await transactionDispatch.handle(
      adjustmentId,
      2,
      adjustmentMetadataDtoCapturer,
    );
    const repositorySpyFindById = jest.spyOn(repository, 'findAdjustmentById');
    const repositorySpyPatchLevel = jest.spyOn(
      repository,
      'patchTransactionLevel',
    );
    const repositorySpyPatchState = jest.spyOn(
      repository,
      'patchAdjustmentState',
    );
    const transactionServiceSpy = jest.spyOn(
      transactionService,
      'sendTransaction',
    );
    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpyFindById).toBeCalledTimes(1);
    expect(repositorySpyPatchLevel).toBeCalledTimes(1);
    expect(repositorySpyPatchState).toBeCalledTimes(1);
    expect(transactionServiceSpy).toBeCalledTimes(1);

    expect(resp).toEqual(responseInterfaceNull);
  });
  it('Should call the next handler if nextLevel is null and returns null', () => {
    //Arrange

    //Act
    const transactionDispatchSpy = jest.spyOn(transactionDispatch, 'handle');
    const resp = transactionDispatch.handle(
      adjustmentId,
      1,
      adjustmentMetadataDtoValidator,
    );
    const repositorySpyFindById = jest.spyOn(repository, 'findAdjustmentById');
    const repositorySpyPatchLevel = jest.spyOn(
      repository,
      'patchTransactionLevel',
    );
    const repositorySpyPatchState = jest.spyOn(
      repository,
      'patchAdjustmentState',
    );
    const transactionServiceSpy = jest.spyOn(
      transactionService,
      'sendTransaction',
    );

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpyPatchLevel).toBeCalledTimes(0);
    expect(repositorySpyPatchState).toBeCalledTimes(0);
    expect(repositorySpyFindById).toBeCalledTimes(1);
    expect(transactionDispatchSpy).toBeCalledTimes(1);
    expect(transactionServiceSpy).toBeCalledTimes(0);

    expect(resp).resolves.toEqual(null);
  });
  it('Should throw an error when the token is wrong', async () => {
    const sendTransactionSpy = jest
      .spyOn(transactionService, 'sendTransaction')
      .mockRejectedValue(new Error('Something went wrong OAuth'));

    sendTransactionSpy.mockRejectedValue(
      new Error('Something went wrong OAuth'),
    );

    await expect(
      transactionDispatch.handle(
        adjustmentId,
        2,
        adjustmentMetadataDtoValidator,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        ErrorCodesEnum.BOS036,
        'Error de validación del token de PTS, por favor reintente de nuevo.',
      ),
    );
  });
  it('Should throw an error when something went wrong with the request', async () => {
    const res = {
      statusRS: {
        description: 'something went wrong',
      },
    };

    jest
      .spyOn(transactionService, 'sendTransaction')
      .mockRejectedValue(new Error(JSON.stringify(res)));

    await expect(
      transactionDispatch.handle(
        adjustmentId,
        2,
        adjustmentMetadataDtoValidator,
      ),
    ).rejects.toThrow(
      new BadRequestException(ErrorCodesEnum.BOS006, {
        message: 'something went wrong',
        id: adjustmentId,
      }),
    );
  });
});
