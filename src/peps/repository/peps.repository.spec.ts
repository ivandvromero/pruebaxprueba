import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../shared/db/connection/connection.service';
import { PepsRepository } from './peps.repository';
import { LoggerModule } from '@dale/logger-nestjs';
import { dataToUpdatePep, outputPepCreated } from '../shared/mocks/test-cases';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Peps Repository Testing', () => {
  let repository: PepsRepository;
  let dbService: DatabaseService;

  const mockSave = jest.fn(() => Promise.resolve(outputPepCreated));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          context: 'Peps - MODULE',
        }),
      ],
      providers: [
        PepsRepository,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: mockSave,
              create: jest.fn().mockResolvedValue(outputPepCreated),
              findOne: jest.fn().mockResolvedValue(outputPepCreated),
              update: jest.fn().mockResolvedValue(outputPepCreated),
            })),
            isDbConnectionAlive: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    repository = module.get<PepsRepository>(PepsRepository);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  it('Should be repository defined', () => {
    expect(repository).toBeDefined();
    expect(dbService).toBeDefined();
  });

  it('Should create a new pep', async () => {
    await repository.onModuleInit();

    const resp = await repository.create(outputPepCreated);
    expect(resp).toEqual(outputPepCreated);
  });

  it('Should throw new error when trying to create peps', async () => {
    jest.spyOn(dbService, 'getRepository').mockReturnValue({
      create: jest.fn().mockResolvedValue(outputPepCreated),
      save: jest.fn().mockRejectedValueOnce({
        code: '23502',
      }),
    });
    await repository.onModuleInit();
    await expect(repository.create(null)).rejects.toThrow(
      new BadRequestException('Error al guardar el PEPS'),
    );
  });

  it('Should find a pep by identification', async () => {
    await repository.onModuleInit();

    const resp = await repository.findByIdentification('CC 9358305093');
    expect(resp).toEqual(outputPepCreated);
  });

  it('Should throw new error when find a pep by identification', async () => {
    jest.spyOn(dbService, 'getRepository').mockReturnValue({
      findOne: jest
        .fn()
        .mockRejectedValueOnce(
          'El usuario con la identificación: CC 43858734 no fue encontrado.',
        ),
    });
    await repository.onModuleInit();
    await expect(
      repository.findByIdentification('CC 43858734'),
    ).rejects.toThrow(
      new NotFoundException(
        'El usuario con la identificación: CC 43858734 no fue encontrado.',
      ),
    );
  });

  it('Should update a pep', async () => {
    await repository.onModuleInit();

    const resp = await repository.patchPep(dataToUpdatePep);
    expect(resp).toEqual({ message: 'Pass to next level 2' });
  });

  it('Should throw new error when try update a pep', async () => {
    jest.spyOn(dbService, 'getRepository').mockReturnValue({
      update: jest.fn().mockRejectedValueOnce('Error al actualizar el PEP'),
    });
    await repository.onModuleInit();
    await expect(repository.patchPep(null)).rejects.toThrow(
      new NotFoundException('Error al actualizar el PEP'),
    );
  });
});
