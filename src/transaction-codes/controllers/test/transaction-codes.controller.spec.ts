import { Logger, LoggerModule } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCodeController } from '../transaction-codes.controller';
import { TransactionCodeService } from '../../services/transaction-codes.service';
import {
  outputTransactionCode,
  outputTransactionCodes,
} from '@dale/testcases/dtos-testcases';
import { DynamodbModule } from '@dale/aws-nestjs';
import { transactionCodes } from '../../shared/common/transactionCodes';
import { DYNAMO_TABLE } from '../../../shared/constants/constants';

describe('Role Controller Testing', () => {
  let controller: TransactionCodeController;
  let service: TransactionCodeService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionCodeController],
      providers: [
        TransactionCodeService,
        {
          provide: TransactionCodeService,
          useValue: {
            createTransactionCode: jest
              .fn()
              .mockImplementation(() => Promise.resolve(outputTransactionCode)),
            insertManyTransactionCodes: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(outputTransactionCodes),
              ),
            deleteTransactionCodes: jest
              .fn()
              .mockImplementation(() => Promise.resolve(true)),
          },
        },
        {
          provide: Logger,
          useFactory: () => ({
            debug: jest.fn(),
          }),
        },
      ],
      imports: [
        DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
        LoggerModule.forRoot({ context: 'Transaction Codes MODULE' }),
      ],
    }).compile();

    controller = module.get<TransactionCodeController>(
      TransactionCodeController,
    );
    service = module.get<TransactionCodeService>(TransactionCodeService);
    logger = module.get<Logger>(Logger);
  });

  it('Should be controller defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  it('Should create a new transaction code', async () => {
    const repositorySpy = jest.spyOn(service, 'createTransactionCode');
    const resp = service.createTransactionCode(outputTransactionCode);

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputTransactionCode);
  });

  it('Should insert many transaction codes', async () => {
    const repositorySpy = jest.spyOn(service, 'insertManyTransactionCodes');
    const resp = service.insertManyTransactionCodes(transactionCodes);

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).resolves.toEqual(outputTransactionCodes);
  });

  it('Should delete content of tables and return true if success ', async () => {
    const repositorySpy = jest.spyOn(service, 'deleteTransactionCodes');
    const resp = await controller.deleteTransactionCodes();

    expect(resp).toBeDefined();
    expect(repositorySpy).toBeCalledTimes(1);

    expect(resp).toEqual(true);
  });
});
