import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { MassiveTransactionLevel } from './massive-transaction-level';
import {
  responseInterface,
  fileMassiveMonetaryAdjustmentsMock,
  adjustmentId,
  newTransactionLevel,
  adjustmentMetadataDtoValidator,
} from '@dale/testcases/dtos-testcases';
import { MassiveMonetaryAdjustmentFileRepository } from '@dale/monetary-adjustment/repositories/file-monetary-adjustment/massive-monetary-adjustment-file.repository';

describe('TransactionLevel', () => {
  let repository: MassiveMonetaryAdjustmentFileRepository;
  let massiveTransactionLevel: MassiveTransactionLevel;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MassiveTransactionLevel,

        {
          provide: MassiveMonetaryAdjustmentFileRepository,
          useValue: {
            patchTransactionLevel: jest.fn(() => {
              return responseInterface;
            }),
            getOneMassive: jest.fn(() => {
              return fileMassiveMonetaryAdjustmentsMock;
            }),
            patchSingleAdjustment: jest.fn(() => {
              return true;
            }),
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

    repository = module.get<MassiveMonetaryAdjustmentFileRepository>(
      MassiveMonetaryAdjustmentFileRepository,
    );
    logger = module.get<Logger>(Logger);
    massiveTransactionLevel = module.get<MassiveTransactionLevel>(
      MassiveTransactionLevel,
    );
  });

  it('Should be transactionLevel, repository and logger defined', () => {
    expect(repository).toBeDefined();
    expect(massiveTransactionLevel).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should call patchTransactionLevel if the nextLevel exists', () => {
    //Arrange

    //Act
    const resp = massiveTransactionLevel.handle(
      adjustmentId,
      newTransactionLevel,
      adjustmentMetadataDtoValidator,
    );
    const repositorySpy = jest.spyOn(repository, 'patchTransactionLevel');

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(responseInterface);
  });
  it('Should call the next handler if nextLevel is null and returns null', () => {
    //Arrange

    //Act
    const transactionLevelSpy = jest.spyOn(massiveTransactionLevel, 'handle');
    const resp = massiveTransactionLevel.handle(
      adjustmentId,
      null,
      adjustmentMetadataDtoValidator,
    );
    const repositorySpy = jest.spyOn(repository, 'patchTransactionLevel');

    //Assert
    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(0);
    expect(transactionLevelSpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(null);
  });
});
