import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionsWithHeadersUseCase } from '@dale/client/use-cases';
import { MambuService } from './mambu.service';
import { GetClientByIdentificationNumberUseCase } from '@dale/client/use-cases/get-client-by-identification-number-use-case';
import {
  transactionWithHeaders,
  clientDto,
  transactionWithoutDate,
  transactionWithDate,
} from '@dale/testcases/client-testcases';

describe('TransactionService', () => {
  let service: MambuService;
  let getTransactionsWithHeadersUseCase: GetTransactionsWithHeadersUseCase;
  let getClientByIdentificationNumberUseCase: GetClientByIdentificationNumberUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MambuService,
        {
          provide: GetTransactionsWithHeadersUseCase,
          useValue: {
            apply: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(transactionWithHeaders),
              ),
          },
        },
        {
          provide: GetClientByIdentificationNumberUseCase,
          useValue: {
            apply: jest
              .fn()
              .mockImplementation(() => Promise.resolve(clientDto)),
          },
        },
      ],
    }).compile();

    service = module.get<MambuService>(MambuService);
    getTransactionsWithHeadersUseCase =
      module.get<GetTransactionsWithHeadersUseCase>(
        GetTransactionsWithHeadersUseCase,
      );
    getClientByIdentificationNumberUseCase =
      module.get<GetClientByIdentificationNumberUseCase>(
        GetClientByIdentificationNumberUseCase,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(getTransactionsWithHeadersUseCase).toBeDefined();
    expect(getClientByIdentificationNumberUseCase).toBeDefined();
  });

  it('should return the count of transactions in mambu when searching without dates', async () => {
    await expect(
      service.getTransactionsCount(transactionWithoutDate),
    ).resolves.toEqual('10');
  });

  it('should return the count of transactions in mambu when searching with dates', async () => {
    await expect(
      service.getTransactionsCount(transactionWithDate),
    ).resolves.toEqual('10');
  });

  it('should return 0 when something wrong happens', async () => {
    jest
      .spyOn(getTransactionsWithHeadersUseCase, 'apply')
      .mockRejectedValueOnce(new Error('Something went wrong'));

    await expect(
      service.getTransactionsCount(transactionWithDate),
    ).resolves.toEqual('0');
  });
});
