import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import {
  outputTransactionCode,
  outputTransactionCodes,
} from '@dale/testcases/dtos-testcases';
import { transactionCodes } from '../../shared/common/transactionCodes';
import { TransactionCodesRepository } from '../..';
import { TransactionCodeService } from '../transaction-codes.service';

describe('Transaction Code Service Testing', () => {
  let service: TransactionCodeService;
  let repository: TransactionCodesRepository;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionCodeService,
        {
          provide: TransactionCodesRepository,
          useFactory: () => ({
            createTransactionCode: jest.fn(() => {
              return Promise.resolve(outputTransactionCode);
            }),
            insertManyTransactionCodes: jest.fn(() => {
              return Promise.resolve(outputTransactionCodes);
            }),
            getDescriptionCode: jest.fn(() => {
              return Promise.resolve('transaction description');
            }),
            deleteManyTransactionCodes: jest.fn(() => {
              return Promise.resolve(true);
            }),
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            debug: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<TransactionCodeService>(TransactionCodeService);
    repository = module.get<TransactionCodesRepository>(
      TransactionCodesRepository,
    );
    logger = module.get<Logger>(Logger);
  });

  it('Should be service defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should create a new transaction code', async () => {
    const repositorySpy = jest.spyOn(repository, 'createTransactionCode');
    const resp = service.createTransactionCode(outputTransactionCode);

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputTransactionCode);
  });

  it('Should insert many transaction codes', async () => {
    const repositorySpy = jest.spyOn(repository, 'insertManyTransactionCodes');
    const resp = service.insertManyTransactionCodes(transactionCodes);

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputTransactionCodes);
  });

  it('Should return a transaction description', async () => {
    const resp = await service.getDescriptionCode('a code');

    expect(resp).toBeDefined();
    expect(resp).toEqual('transaction description');
  });

  it('Should delete content of tables and return true if success ', async () => {
    const resp = await service.deleteTransactionCodes();

    expect(resp).toBeDefined();

    expect(resp).toEqual(true);
  });
});
