import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PepsValidationsService } from '../peps-validations.service';
import { PepsRepository } from '../../../repository/peps.repository';
import { PepsLevel } from '../../chain-handlers/handlers/peps-level';
import { PepsDispatch } from '../../chain-handlers/handlers/peps-dispatch';
import { IPepsValidationsDto } from '../../../shared/interfaces/peps-validations-dto.interface';
import { IPatchPepDto } from '../../../shared/interfaces/patch-pep-dto.interface';
import { PepStatus } from '../../../shared/enums/pep-status.enum';
import { pepsLevels } from '../../../shared/constants/levels';
import { DatabaseService } from '../../../../shared/db/connection/connection.service';
import { LoggerModule } from '@dale/logger-nestjs';
import { outputPepCreated } from '../../../shared/mocks/test-cases';

describe('PepsValidationsService Testing', () => {
  let service: PepsValidationsService;
  let repository: PepsRepository;
  let pepLevels: PepsLevel;
  let pepsDispatch: PepsDispatch;

  const historicalEntity = {
    id: '1',
    date: '10/20/2023',
    answerDate: new Date(),
    identification: 'CC 4683483',
    name: 'Test Test',
    status: PepStatus.REJECTED,
    statusLevel: 1,
    comment: 'Rechazado por...',
    validatorEmail: 'test@example.com',
    approverEmail: 'test@example.com',
    phone: '348689436',
    email: 'email@email.com',
  };

  const payload: IPepsValidationsDto = {
    status: PepStatus.REJECTED,
    comment: null,
    identification: 'CC 4683483',
    date: '10/20/2023',
    name: 'Test Test',
    statusLevel: 1,
    isCreated: false,
    phone: '348689436',
    email: 'email@email.com',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          context: 'Peps Module',
        }),
      ],
      providers: [
        PepsValidationsService,
        {
          provide: PepsRepository,
          useValue: {
            update: jest.fn(() => {
              return Promise.resolve(outputPepCreated);
            }),
            patchPep: jest.fn().mockResolvedValue(true),
            create: jest.fn().mockResolvedValue(true),
            findByIdentification: jest.fn().mockResolvedValue(outputPepCreated),
          },
        },
        PepsLevel,
        PepsDispatch,
        DatabaseService,
      ],
    }).compile();

    service = moduleRef.get<PepsValidationsService>(PepsValidationsService);
    repository = moduleRef.get<PepsRepository>(PepsRepository);
    pepLevels = moduleRef.get<PepsLevel>(PepsLevel);
    pepsDispatch = moduleRef.get<PepsDispatch>(PepsDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('should throw BadRequestException if status is REJECTED and comment is missing', async () => {
      payload.comment = null;

      await expect(service.run(payload)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should call patchPep if PEP exists', async () => {
      payload.isCreated = true;
      payload.status = PepStatus.APPROVED;
      payload.statusLevel = 2;
      payload.validatorEmail = undefined;
      payload.approverEmail = undefined;

      delete payload.date;
      delete payload.name;
      delete payload.isCreated;
      delete payload.email;
      delete payload.phone;

      historicalEntity.status = PepStatus.PENDING;

      const patchPepDto: IPatchPepDto = {
        identification: payload.identification,
        statusLevel: pepsLevels[payload.statusLevel],
        comment: payload.comment,
        status: payload.status,
        answerDate: expect.any(Date),
        validatorEmail: payload.validatorEmail,
        approverEmail: payload.approverEmail,
      };

      const findByIdentificationSpy = jest.spyOn(
        repository,
        'findByIdentification',
      );
      const patchPepSpy = jest.spyOn(repository, 'patchPep');
      const createSpy = jest.spyOn(repository, 'create');

      findByIdentificationSpy.mockResolvedValue(
        Promise.resolve(historicalEntity),
      );

      await service.run(payload);

      expect(findByIdentificationSpy).toHaveBeenCalledWith(
        payload.identification,
      );
      expect(patchPepSpy).toHaveBeenCalledWith(patchPepDto);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should call pepLevels.handle and pepsDispatch.handle if status is not REJECTED', async () => {
      payload.status = PepStatus.APPROVED;
      payload.isCreated = true;
      payload.statusLevel = 2;

      const pepLevelsResponse = { example: 'pepLevels response' };
      const pepsDispatchResponse = { example: 'pepsDispatch response' };

      const handlePepLevelsSpy = jest
        .spyOn(pepLevels, 'handle')
        .mockResolvedValue(pepLevelsResponse);
      const handlePepsDispatchSpy = jest
        .spyOn(pepsDispatch, 'handle')
        .mockResolvedValue(pepsDispatchResponse);

      jest
        .spyOn(repository, 'findByIdentification')
        .mockResolvedValue({ ...payload, status: PepStatus.PENDING });

      const result = await service.run(payload);

      expect(handlePepLevelsSpy).toHaveBeenCalledWith(payload);
      expect(handlePepsDispatchSpy).toHaveBeenCalledWith({
        ...payload,
        answerDate: expect.any(Date),
      });
      expect(result).toEqual(pepLevelsResponse);
    });

    it('should throw BadRequestException if statusLevel is 1 and PEP exists', async () => {
      payload.statusLevel = 1;

      jest
        .spyOn(repository, 'findByIdentification')
        .mockResolvedValue({ ...payload, status: PepStatus.PENDING });

      await expect(service.run(payload)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if PEP status is REJECTED and statusLevel is greater than or equal to 1', async () => {
      payload.statusLevel = 2;

      jest
        .spyOn(repository, 'findByIdentification')
        .mockResolvedValue({ ...payload, status: PepStatus.REJECTED });

      await expect(service.run(payload)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if PEP status is not PENDING and statusLevel is greater than 1', async () => {
      payload.statusLevel = 2;

      jest
        .spyOn(repository, 'findByIdentification')
        .mockResolvedValue({ ...payload, status: PepStatus.APPROVED });

      await expect(service.run(payload)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if PEP does not exist and statusLevel is greater than 1', async () => {
      payload.statusLevel = 2;

      jest.spyOn(repository, 'findByIdentification').mockResolvedValue(null);

      await expect(service.run(payload)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if status is REJECTED and comment is missing', async () => {
      payload.status = PepStatus.REJECTED;
      payload.comment = null;

      await expect(service.run(payload)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
