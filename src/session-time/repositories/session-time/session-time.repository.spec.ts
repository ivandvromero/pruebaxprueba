import { Test, TestingModule } from '@nestjs/testing';
import { SessionTimeRepository } from './session-time.repository';
import { DatabaseService } from '@dale/db/connection/connection.service';
import { Logger } from '@dale/logger-nestjs';
import {
  createSessionTime,
  createSessionTimeResp,
  createSessionTimeWithRole,
  roleFound,
  updateSessionTime,
} from '@dale/testcases/sesion-time-testcases';
import { BadRequestException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

describe('Session time repository testing', () => {
  let repository: SessionTimeRepository;
  let dbService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionTimeRepository,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: jest.fn().mockResolvedValue(createSessionTimeResp),
              create: jest.fn().mockResolvedValue(createSessionTimeResp),
              find: jest.fn().mockResolvedValue(createSessionTimeResp),
              findOne: jest.fn().mockResolvedValue(createSessionTime),
            })),
            isDbConnectionAlive: jest.fn(() => true),
          }),
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<SessionTimeRepository>(SessionTimeRepository);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  it('Should be repository defined', () => {
    expect(repository).toBeDefined();
    expect(dbService).toBeDefined();
  });

  it('should return true when isDbConnectionAlive function get called', async () => {
    const result = await repository.isDbConnectionAlive();
    expect(result).toBe(true);
  });

  describe('get session time', () => {
    it('Should find one session time entity when searching by role entity', async () => {
      await repository.onModuleInit();
      const resp = await repository.getSessionTime(roleFound);
      expect(resp).toEqual(createSessionTime);
    });

    it('Should throw an error when trying to search one session time by role entity', async () => {
      jest.spyOn(dbService, 'getRepository').mockReturnValue({
        findOne: jest.fn().mockRejectedValue('Something went wrong'),
      });
      await repository.onModuleInit();
      await expect(repository.getSessionTime(roleFound)).rejects.toThrow(
        new BadRequestException(
          ErrorCodesEnum.BOS037,
          'Error al consultar el tiempo de sesión el ajuste monetario.',
        ),
      );
    });
  });

  describe('get all session time', () => {
    it('Should find all the session times', async () => {
      await repository.onModuleInit();
      const resp = await repository.getAllSessionTime();
      expect(resp).toEqual(createSessionTimeResp);
    });

    it('Should throw an error when trying to search all the session times', async () => {
      jest.spyOn(dbService, 'getRepository').mockReturnValue({
        find: jest.fn().mockRejectedValue('Something went wrong'),
      });
      await repository.onModuleInit();
      await expect(repository.getAllSessionTime()).rejects.toThrow(
        new BadRequestException(
          ErrorCodesEnum.BOS037,
          'Error al consultar el tiempo de sesión el ajuste monetario.',
        ),
      );
    });
  });

  describe('create a new session time', () => {
    it('Should create a new session time', async () => {
      await repository.onModuleInit();
      const resp = await repository.createSessionTime(
        createSessionTimeWithRole,
      );
      expect(resp).toEqual(createSessionTimeResp);
    });

    it('Should throw an error when trying to create a new session time', async () => {
      jest.spyOn(dbService, 'getRepository').mockReturnValue({
        create: jest.fn().mockRejectedValue('Something went wrong'),
        save: jest.fn().mockRejectedValue('Something went wrong'),
      });
      await repository.onModuleInit();
      await expect(repository.getAllSessionTime()).rejects.toThrow(
        new BadRequestException(
          ErrorCodesEnum.BOS038,
          'Error al crear el tiempo de sesión.',
        ),
      );
    });
  });

  describe('update a session time', () => {
    it('Should update a session time', async () => {
      jest.spyOn(dbService, 'getRepository').mockReturnValue({
        update: jest.fn().mockResolvedValue(true),
        findOne: jest.fn().mockResolvedValue(updateSessionTime),
      });
      await repository.onModuleInit();
      const resp = await repository.updateSessionTime(updateSessionTime);
      expect(resp).toEqual(updateSessionTime);
    });

    it('Should throw an error when trying to update a session time', async () => {
      jest.spyOn(dbService, 'getRepository').mockReturnValue({
        update: jest.fn().mockRejectedValue('Something went wrong'),
        findone: jest.fn().mockRejectedValue('Something went wrong'),
      });
      await repository.onModuleInit();
      await expect(
        repository.updateSessionTime(updateSessionTime),
      ).rejects.toThrow(
        new BadRequestException(
          ErrorCodesEnum.BOS040,
          'Error al actualizar el tiempo de sesión.',
        ),
      );
    });
  });
});
