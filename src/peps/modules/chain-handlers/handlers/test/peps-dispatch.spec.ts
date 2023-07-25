import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { PepsDispatch } from '../peps-dispatch';
import { PepsRepository } from '../../../../repository/peps.repository';
import { IPatchPepDto } from '../../../../shared/interfaces/patch-pep-dto.interface';
import { PepStatus } from '../../../../shared/enums/pep-status.enum';
import { pepsLevels } from '../../../../shared/constants/levels';
import { AbstractPepHandler } from '../../abstract-handler';

describe('PepsDispatch Testing', () => {
  let pepsDispatch: PepsDispatch;
  let repository: PepsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PepsDispatch,
        {
          provide: PepsRepository,
          useValue: {
            patchPep: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    pepsDispatch = moduleRef.get<PepsDispatch>(PepsDispatch);
    repository = moduleRef.get<PepsRepository>(PepsRepository);
  });

  describe('handle', () => {
    it('should call Onboarding when the next level is null and patchPep succeeds', async () => {
      const payload: IPatchPepDto = {
        identification: '123456789',
        statusLevel: 2,
        comment: 'Test comment',
        status: PepStatus.APPROVED,
        validatorEmail: 'test@example.com',
      };

      const nextLevel = pepsLevels[payload.statusLevel || 1];

      jest.spyOn(repository, 'patchPep').mockResolvedValueOnce({} as any);

      const result = await pepsDispatch.handle(payload);

      expect(repository.patchPep).toHaveBeenCalledWith({
        ...payload,
        statusLevel: nextLevel,
      });
      expect(result).toEqual({
        result: true,
        nextLevel: nextLevel,
        identification: payload.identification,
      });
    });

    it('should throw BadRequestException when the next level is null and patchPep fails', async () => {
      const payload: IPatchPepDto = {
        identification: '123456789',
        statusLevel: 2,
        comment: 'Test comment',
        status: PepStatus.APPROVED,
        validatorEmail: 'test@example.com',
      };

      const nextLevel = pepsLevels[payload.statusLevel || 1];

      const errorMessage = `Ocurrio un error al hacer al hacer ${
        payload.status === PepStatus.APPROVED ? 'la aprobación' : 'el rechazo'
      } del PEP con identificación ${payload.identification}`;

      jest
        .spyOn(repository, 'patchPep')
        .mockRejectedValueOnce(new BadRequestException(errorMessage));

      await expect(pepsDispatch.handle(payload)).rejects.toThrow(
        BadRequestException,
      );

      expect(repository.patchPep).toHaveBeenCalledWith({
        ...payload,
        statusLevel: nextLevel,
      });
    });

    it('should call the base class handle method when the next level is not null', async () => {
      const payload: IPatchPepDto = {
        identification: '123456789',
        statusLevel: null,
        comment: 'Test comment',
        status: PepStatus.APPROVED,
        validatorEmail: 'test@example.com',
      };

      const baseHandleResult = {
        result: false,
        nextLevel: null,
      };

      const baseHandleMock = jest
        .spyOn(AbstractPepHandler.prototype, 'handle')
        .mockReturnValueOnce(Promise.resolve(baseHandleResult));

      const result = await pepsDispatch.handle(payload);

      expect(repository.patchPep).not.toHaveBeenCalled();
      expect(baseHandleMock).toHaveBeenCalledWith(payload);
      expect(result).toEqual(baseHandleResult);
    });
  });
});
