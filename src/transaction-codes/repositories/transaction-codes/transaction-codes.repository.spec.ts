import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@dale/logger-nestjs';
import { TransactionCodesRepository } from './transaction-codes.repository';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { FindRolesService } from '@dale/roles/services';
import {
  outputTransactionCode,
  transactionCode,
  code,
  outputTransactionCodes,
  outputRole,
  transactionCodes,
  mappedRoles,
  transactionCodeFound,
  codesFound,
} from '@dale/testcases/dtos-testcases';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

describe('Transaction Codes Repository Testing', () => {
  let repository: TransactionCodesRepository;
  let dbService: DatabaseService;
  let findRolesService: FindRolesService;

  const mockSave = jest.fn(() => Promise.resolve(outputTransactionCode));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          context: 'Transaction Code - MODULE',
        }),
      ],
      providers: [
        TransactionCodesRepository,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: mockSave,
              create: jest.fn().mockResolvedValue(transactionCode),
              findOneBy: jest.fn().mockResolvedValue(code),
              findOne: jest.fn().mockResolvedValue(codesFound),
              createQueryBuilder: () => ({
                insert: jest.fn().mockReturnThis(),
                into: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockReturnThis(),
                execute: jest
                  .fn()
                  .mockResolvedValue({ generatedMaps: outputTransactionCodes }),
                relation: jest.fn().mockReturnThis(),
                of: jest.fn().mockReturnThis(),
                add: jest.fn().mockReturnThis(),
              }),
            })),
            queryRunner: {
              connect: jest.fn().mockResolvedValue(true),
              startTransaction: jest.fn().mockResolvedValue(true),
              commitTransaction: jest.fn().mockResolvedValue(true),
              query: jest.fn().mockResolvedValue(true),
            },
          }),
        },
        {
          provide: FindRolesService,
          useValue: {
            run: jest.fn(() => {
              return Promise.resolve([outputRole]);
            }),
          },
        },
      ],
    }).compile();

    repository = module.get<TransactionCodesRepository>(
      TransactionCodesRepository,
    );
    dbService = module.get<DatabaseService>(DatabaseService);
    findRolesService = module.get<FindRolesService>(FindRolesService);
  });

  it('Should be repository defined', () => {
    expect(repository).toBeDefined();
    expect(dbService).toBeDefined();
    expect(findRolesService).toBeDefined();
  });

  it('Should create a new transaction code', async () => {
    await repository.onModuleInit();
    const resp = await repository.createTransactionCode(transactionCode);
    expect(resp).toEqual(outputTransactionCode);
  });

  it('Should throw new error when try create a new transaction code', async () => {
    try {
      await repository.onModuleInit();
      await repository.createTransactionCode(null);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should insert multiple transaction codes into the database', async () => {
    await repository.onModuleInit();
    const repositorySpy = jest.spyOn(repository, 'insertManyTransactionCodes');
    const result = await repository.insertManyTransactionCodes(
      transactionCodes,
    );

    expect(result).toEqual(outputTransactionCodes);
    expect(repositorySpy).toHaveBeenCalledWith(transactionCodes);
  });

  it('should throw new error when insert multiple transaction codes into the database', async () => {
    try {
      await repository.onModuleInit();
      const repositorySpy = await jest.spyOn(
        repository,
        'insertManyTransactionCodes',
      );
      await repository.insertManyTransactionCodes(null);

      expect(repositorySpy).toHaveBeenCalledWith(transactionCodes);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return the description of a code', async () => {
    await repository.onModuleInit();
    const resp = await repository.getDescriptionCode('COU0012A');

    expect(resp).toBe(
      'Ajuste Débito por pago TD Dale! - Cargo a un Deposito Electrónico por compras E-commerce',
    );
  });

  it('should return not found code if something went wrong', async () => {
    jest.spyOn(dbService, 'getRepository').mockReturnValue({
      findOneBy: jest.fn().mockRejectedValue(new Error()),
    });
    await repository.onModuleInit();

    const resp = await repository.getDescriptionCode('COU0012A');

    expect(resp).toBe('No se ha encontrado el código');
  });

  it('Should find all the roles of the code', async () => {
    await repository.onModuleInit();

    const resp = await repository.getRolesByCode(transactionCodeFound);
    expect(resp).toStrictEqual(mappedRoles);
  });

  it('Should throw an error if the code is not found', async () => {
    jest.spyOn(dbService, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue(undefined),
    });
    await repository.onModuleInit();

    await expect(
      repository.getRolesByCode(transactionCodeFound),
    ).rejects.toThrow(
      new NotFoundException(
        ErrorCodesEnum.BOS025,
        'El código del ajuste monetario no se ha encontrado en la base de datos.',
      ),
    );
  });

  it('Should delete content of tables and return true if success ', async () => {
    await repository.onModuleInit();

    const resp = await repository.deleteManyTransactionCodes();
    expect(resp).toEqual(true);
  });
});
