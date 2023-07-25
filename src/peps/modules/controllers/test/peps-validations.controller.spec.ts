import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamodbModule } from '@dale/aws-nestjs';
import { LoggerModule } from '@dale/logger-nestjs';
import { PepsValidationsController } from '../peps-validations.controller';
import { PepsValidationsService } from '../../services/peps-validations.service';
import { IPepsValidationsDto } from '../../../shared/interfaces/peps-validations-dto.interface';
import { PepStatus } from '../../../shared/enums/pep-status.enum';
import { PepsLevel } from '../../chain-handlers/handlers/peps-level';
import { PepsDispatch } from '../../chain-handlers/handlers/peps-dispatch';
import { PepsRepository } from '../../../repository/peps.repository';
import { DYNAMO_TABLE } from '../../../../shared/constants/constants';
import { DatabaseService } from '../../../../shared/db/connection/connection.service';

describe('PepsValidationsController Testing', () => {
  let controller: PepsValidationsController;
  let service: PepsValidationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
        LoggerModule.forRoot({ context: 'Peps MODULE' }),
      ],
      controllers: [PepsValidationsController],
      providers: [
        PepsValidationsService,
        PepsLevel,
        PepsDispatch,
        PepsRepository,
        DatabaseService,
      ],
    }).compile();

    controller = module.get<PepsValidationsController>(
      PepsValidationsController,
    );
    service = module.get<PepsValidationsService>(PepsValidationsService);
  });

  describe('run', () => {
    it('should throw BadRequestException if required fields are missing and statusLevel is 1', async () => {
      // Arrange
      const payload = {
        date: '',
        name: '',
        identification: '',
        status: PepStatus.APPROVED,
        statusLevel: 1,
        comment: '',
        isCreated: false,
        email: '',
        phone: '',
      };
      const req = {
        user: {
          permissions: 'CommercialLeader:write',
          email: 'test@example.com',
        },
      };

      // Act & Assert
      await expect(controller.run(payload, req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when the user is not found', () => {
      // Arrange
      const payload: IPepsValidationsDto = {
        status: PepStatus.REJECTED,
        comment: 'Rechazado por...',
        identification: 'CC 9082543573',
        date: '10/20/2023',
        name: 'Test Test',
        statusLevel: 1,
        isCreated: false,
        phone: '348689436',
        email: 'email@email.com',
      };

      // Act & Assert
      expect(() =>
        controller.run(payload, {
          user: {
            permissions: 'CommercialLeader:write',
            email: 'test@example.com',
          },
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should call service.run with the correct data if required fields are present and statusLevel is not 1', async () => {
      const payload: IPepsValidationsDto = {
        status: PepStatus.APPROVED,
        comment: 'Aprobado por...',
        identification: 'CC 4683483',
        date: '10/20/2023',
        name: 'Test Test',
        statusLevel: 2,
        isCreated: false,
        phone: '348689436',
        email: 'email@email.com',
      };
      const expectedData = {
        ...payload,
        approverEmail: 'test@example.com',
        statusLevel: 2,
      };
      jest.spyOn(service, 'run').mockResolvedValue({
        result: true,
        nextLevel: null,
        identification: 'C.C 9082543573',
      });

      const result = await controller.run(payload, {
        user: {
          permissions: 'CommercialBoss:read',
          email: 'test@example.com',
        },
      });

      expect(service.run).toHaveBeenCalledWith(expectedData);
      expect(result).toEqual({
        result: true,
        nextLevel: null,
        identification: 'C.C 9082543573',
      });
    });
  });
});
