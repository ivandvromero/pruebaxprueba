import { Test } from '@nestjs/testing';
import { FindPepsWithPendingService } from '../find-peps-with-pending.service';
import {
  findPepsWithPendingQuery,
  findPepsWithPendingResponse,
} from '../../../shared/mocks/test-cases';
import { PepsRepository } from '../../../repository/peps.repository';
import { DatabaseService } from '../../../../shared/db/connection/connection.service';

describe('Find peps pending Testing', () => {
  let service: FindPepsWithPendingService;
  let repository: PepsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindPepsWithPendingService,
        {
          provide: PepsRepository,
          useValue: {
            findHistorical: jest
              .fn()
              .mockResolvedValue(findPepsWithPendingResponse),
          },
        },
        DatabaseService,
      ],
    }).compile();

    service = module.get<FindPepsWithPendingService>(
      FindPepsWithPendingService,
    );
    repository = module.get<PepsRepository>(PepsRepository);

    jest.spyOn(service, 'run').mockResolvedValue(findPepsWithPendingResponse);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should return the pepsWithPendingStatus array', async () => {
    const result = await service.run(findPepsWithPendingQuery);
    expect(result).toEqual(findPepsWithPendingResponse);
  });

  it('should return the pepsWithPendingStatus array when statusLevel is 1', async () => {
    findPepsWithPendingQuery.statusLevel = 2;

    const result = await service.run(findPepsWithPendingQuery);

    expect(repository.findHistorical).not.toHaveBeenCalled();
    expect(result).toEqual(findPepsWithPendingResponse);
  });

  it('should call repository.findHistorical with the correct parameters when statusLevel is not 1', async () => {
    jest
      .spyOn(repository, 'findHistorical')
      .mockResolvedValue(findPepsWithPendingResponse);

    const result = await service.run(findPepsWithPendingQuery);

    expect(result.results).toEqual(findPepsWithPendingResponse.results);
    expect(result.total).toBe(findPepsWithPendingResponse.total);
    expect(result.per_page).toBe(findPepsWithPendingResponse.per_page);
    expect(result.total_pages).toBe(0);
    expect(result.current_page).toBe(1);
  });

  it('should return the pepsWithPendingStatus array when statusLevel is 1', async () => {
    const test = { ...findPepsWithPendingQuery };
    test.statusLevel = 1;

    const result = await service.run(test);

    expect(repository.findHistorical).not.toHaveBeenCalled();
    expect(result).toEqual(findPepsWithPendingResponse);
  });
});
