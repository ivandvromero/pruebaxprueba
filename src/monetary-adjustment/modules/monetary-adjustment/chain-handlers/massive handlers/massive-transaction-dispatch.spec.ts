import { Test, TestingModule } from '@nestjs/testing';

import { Logger } from '@dale/logger-nestjs';

import { TransactionService } from '@dale/client/modules/services/transaction.service';
import { MassiveTransactionDispatch } from './massive-transaction-dispatch';
import { MassiveMonetaryAdjustmentFileRepository } from '@dale/monetary-adjustment/repositories/file-monetary-adjustment/massive-monetary-adjustment-file.repository';
import { mockResponseTransactionPts } from '@dale/testcases/client-testcases';
import {
  responseInterface,
  adjustmentId,
  ptsError,
  anError,
  responseInterfaceDispatch,
  responseInterfaceDispatchWithErrors,
  adjustmentMetadataDto,
  responseInterfaceDispatchFailed,
} from '@dale/testcases/dtos-testcases';
import { massiveAdjustmentLevel2 } from '@dale/testcases/massive-testcases';

describe('TransactionDispatch', () => {
  let repository: MassiveMonetaryAdjustmentFileRepository;
  let massiveTransactionDispatch: MassiveTransactionDispatch;
  let transactionService: TransactionService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
          provide: MassiveMonetaryAdjustmentFileRepository,
          useValue: {
            getOneMassive: jest.fn(() => {
              return Promise.resolve(massiveAdjustmentLevel2);
            }),
            patchTransactionLevel: jest.fn(() => {
              return responseInterface;
            }),
            patchAdjustmentState: jest.fn(() => {
              return responseInterface;
            }),
            updateSingleAdjustmentsFromFile: jest.fn(() => {
              return Promise.resolve({ hasError: false, notAccepted: false });
            }),
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

    repository = module.get<MassiveMonetaryAdjustmentFileRepository>(
      MassiveMonetaryAdjustmentFileRepository,
    );
    massiveTransactionDispatch = module.get<MassiveTransactionDispatch>(
      MassiveTransactionDispatch,
    );
    logger = module.get<Logger>(Logger);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('Should be transactionDispatch, repository and logger defined', () => {
    expect(repository).toBeDefined();
    expect(massiveTransactionDispatch).toBeDefined();
    expect(transactionService).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should call patchTransactionLevel if the nextLevel exists', async () => {
    //Arrange
    //Act
    const resp = await massiveTransactionDispatch.handle(
      adjustmentId,
      2,
      adjustmentMetadataDto,
    );

    const repositorySpyFindById = jest.spyOn(repository, 'getOneMassive');
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
    expect(repositorySpyFindById).toBeCalledTimes(1);
    expect(repositorySpyPatchLevel).toBeCalledTimes(1);
    expect(repositorySpyPatchState).toBeCalledTimes(1);
    expect(transactionServiceSpy).toBeCalledTimes(4);

    expect(resp).toEqual(responseInterfaceDispatch);
  });
  it('Should call the next handler if nextLevel is null and returns null', () => {
    //Arrange

    //Act
    const transactionDispatchSpy = jest.spyOn(
      massiveTransactionDispatch,
      'handle',
    );
    const resp = massiveTransactionDispatch.handle(
      adjustmentId,
      1,
      adjustmentMetadataDto,
    );
    const repositorySpyFindById = jest.spyOn(repository, 'getOneMassive');
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
  it('Should call patchTransactionLevel if the nextLevel exists, dispatch to pts and report accepted with errors the massive monetary adjustment', async () => {
    //Arrange

    jest
      .spyOn(transactionService, 'sendTransaction')
      .mockResolvedValueOnce(mockResponseTransactionPts)
      .mockRejectedValueOnce(new Error(JSON.stringify(ptsError)));

    jest
      .spyOn(repository, 'updateSingleAdjustmentsFromFile')
      .mockResolvedValueOnce({ hasError: false, notAccepted: true });

    //Act
    const resp = await massiveTransactionDispatch.handle(
      adjustmentId,
      2,
      adjustmentMetadataDto,
    );
    //Assert
    expect(resp).toEqual(responseInterfaceDispatchWithErrors);
  });
  it('Should call patchTransactionLevel if the nextLevel exists, dispatch to pts and report failed the massive monetary adjustment', async () => {
    //Arrange

    jest
      .spyOn(transactionService, 'sendTransaction')
      .mockResolvedValueOnce(mockResponseTransactionPts)
      .mockRejectedValueOnce(new Error(JSON.stringify(anError)));

    jest
      .spyOn(repository, 'updateSingleAdjustmentsFromFile')
      .mockResolvedValueOnce({ hasError: true, notAccepted: false });
    //Act
    const resp = await massiveTransactionDispatch.handle(
      adjustmentId,
      2,
      adjustmentMetadataDto,
    );
    //Assert
    expect(resp).toEqual(responseInterfaceDispatchFailed);
  });
});
