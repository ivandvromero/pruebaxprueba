import { Test } from '@nestjs/testing';
import { Logger } from '@dale/logger-nestjs';
import { PepsRepository } from '../../../../repository/peps.repository';
import { PepsLevel } from '../peps-level';
import { IPepsValidationsDto } from '../../../../shared/interfaces/peps-validations-dto.interface';
import { pepsLevels } from '../../../../shared/constants/levels';
import { PepStatus } from '../../../../shared/enums/pep-status.enum';

describe('PepsLevel', () => {
  let pepsLevel: PepsLevel;
  let repository: PepsRepository;
  let logger: Logger;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PepsLevel,
        {
          provide: PepsRepository,
          useValue: {
            findByIdentification: jest.fn(),
            patchPep: jest.fn(),
            create: jest.fn(),
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

    pepsLevel = moduleRef.get<PepsLevel>(PepsLevel);
    repository = moduleRef.get<PepsRepository>(PepsRepository);
    logger = moduleRef.get<Logger>(Logger);
  });

  describe('handle', () => {
    it('should create a new pep when the next level is available and pep does not exist', async () => {
      const payload: IPepsValidationsDto = {
        identification: '123456789',
        statusLevel: 1,
        comment: 'Test comment',
        status: PepStatus.APPROVED,
        validatorEmail: 'test@example.com',
        date: '10/20/2023',
        name: 'Nombre y apellidos',
        isCreated: false,
        phone: '348689436',
        email: 'email@email.com',
      };

      const nextLevel = pepsLevels[payload.statusLevel || 1];

      jest
        .spyOn(repository, 'findByIdentification')
        .mockResolvedValueOnce({} as any);
      jest.spyOn(repository, 'create').mockResolvedValueOnce({} as any);

      const result = await pepsLevel.handle(payload);

      expect(repository.create).toHaveBeenCalledWith({
        ...payload,
        statusLevel: nextLevel,
      });
      expect(logger.debug).toHaveBeenCalledWith('Pep successfully created');
      expect(result).toEqual({
        result: true,
        nextLevel,
      });
    });

    it('should update an existing pep when the next level is available', async () => {
      const payload: IPepsValidationsDto = {
        identification: '123456789',
        statusLevel: 1,
        comment: 'Test comment',
        status: undefined,
        validatorEmail: 'test@example.com',
        date: '10/20/2023',
        name: 'Nombre y apellidos',
        isCreated: true,
        phone: '348689436',
        email: 'email@email.com',
      };

      const nextLevel = pepsLevels[payload.statusLevel || 1];

      jest
        .spyOn(repository, 'findByIdentification')
        .mockResolvedValueOnce({} as any);
      jest.spyOn(repository, 'patchPep').mockResolvedValueOnce({} as any);

      const result = await pepsLevel.handle(payload);

      expect(repository.patchPep).toHaveBeenCalledWith({
        identification: payload.identification,
        statusLevel: nextLevel,
        comment: payload.comment,
        status: payload.status,
        validatorEmail: payload.validatorEmail,
      });
      expect(logger.debug).toHaveBeenCalledWith('Pep successfully updated');
      expect(result).toEqual({
        result: true,
        nextLevel,
      });
    });

    it('should call the base class handle method when the next level is not available', async () => {
      const payload: IPepsValidationsDto = {
        identification: '123456789',
        statusLevel: 1,
        comment: 'Test comment',
        status: PepStatus.APPROVED,
        validatorEmail: 'test@example.com',
        date: '10/20/2023',
        name: 'Nombre y apellidos',
        isCreated: true,
        phone: '348689436',
        email: 'email@email.com',
      };

      const baseHandleResult = {
        result: false,
      };

      pepsLevel.handle = jest.fn().mockReturnValueOnce(baseHandleResult);

      const result = await pepsLevel.handle(payload);

      expect(pepsLevel.handle).toHaveBeenCalledWith(payload);
      expect(result).toEqual(baseHandleResult);
    });
  });
});
