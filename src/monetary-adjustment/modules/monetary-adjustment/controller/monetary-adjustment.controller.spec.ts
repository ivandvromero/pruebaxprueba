import { Test, TestingModule } from '@nestjs/testing';
import { MonetaryAdjustmentController } from './monetary-adjustment.controller';

import { Response } from 'express';
import { Logger, LoggerModule } from '@dale/logger-nestjs';
import { ConfigService } from '@nestjs/config';
import { DynamodbModule } from '@dale/aws-nestjs';
import {
  outputAdjustment,
  getAdjustmentResponseWithPagination,
  rejectResponseInterface,
  mockAdjustmentStateDto,
  req,
  adjustmentDto,
  adjustmentQuery,
  adjustmentId,
  adjustmentRejected,
  adjustmentRejectedWithoutComment,
  mockGetAdjustmentQueryReportsDto,
  reqValidator,
} from '@dale/testcases/dtos-testcases';
import {
  createMassiveAdjustmentResponse,
  getAllResponsePaginated,
  getReportsPaginated,
  massiveAdjustmentDto,
  bufferMock,
  sendMock,
  setHeaderMock,
  mockParamsArchive,
  searchQuery,
  dbCodesByRole,
} from '@dale/testcases/massive-testcases';
import { DYNAMO_TABLE } from '../../../../shared/constants/constants';
import { MonetaryAdjustmentService } from '../service/monetary-adjustment.service';
import { FindCodesByRoleService } from '@dale/roles/services';

describe('MonetaryAdjustmentController', () => {
  let controller: MonetaryAdjustmentController;
  let service: MonetaryAdjustmentService;
  let roleCodesService: FindCodesByRoleService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonetaryAdjustmentController],
      providers: [
        {
          provide: MonetaryAdjustmentService,
          useValue: {
            createAdjustment: jest
              .fn()
              .mockImplementation(() => Promise.resolve(outputAdjustment)),
            findAll: jest
              .fn()
              .mockResolvedValue(getAdjustmentResponseWithPagination),
            findAdjustmentById: jest
              .fn()
              .mockImplementation(() => Promise.resolve(outputAdjustment)),
            adjustmentValidations: jest
              .fn()
              .mockResolvedValue(rejectResponseInterface),
            createMassiveAdjustment: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(createMassiveAdjustmentResponse),
              ),
            findAllMassiveAdjustment: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(getAllResponsePaginated),
              ),
            adjustmentFiletValidations: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(rejectResponseInterface),
              ),
            createArchive: jest
              .fn()
              .mockImplementation(() => Promise.resolve(new Uint8Array())),
            getFormattedName: jest
              .fn()
              .mockImplementation(() => Promise.resolve('archivo.xlsx')),
            reprocessFile: jest.fn().mockImplementation(),
            getAdjustmentState: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(mockAdjustmentStateDto),
              ),
            countPendingIndividual: jest
              .fn()
              .mockImplementation(() => Promise.resolve(1)),
            countPendingMassive: jest
              .fn()
              .mockImplementation(() => Promise.resolve(1)),
            adjustmentReports: jest
              .fn()
              .mockImplementation(() => Promise.resolve(getReportsPaginated)),
            generateArchiveReport: jest
              .fn()
              .mockImplementation(() => Promise.resolve(new Uint8Array())),
          },
        },
        {
          provide: FindCodesByRoleService,
          useValue: {
            run: jest.fn(() => Promise.resolve(dbCodesByRole)),
          },
        },
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'apiConfigMonetaryAdjustment'),
          },
        },
      ],
      imports: [
        DynamodbModule.forRoot({ tableName: DYNAMO_TABLE }),
        LoggerModule.forRoot({ context: 'Monetary Adjustment MODULE' }),
      ],
    }).compile();

    controller = module.get<MonetaryAdjustmentController>(
      MonetaryAdjustmentController,
    );
    service = module.get<MonetaryAdjustmentService>(MonetaryAdjustmentService);
    roleCodesService = module.get<FindCodesByRoleService>(
      FindCodesByRoleService,
    );
    logger = module.get<Logger>(Logger);
  });

  it('Should be Controller defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(roleCodesService).toBeDefined();
    expect(logger).toBeDefined();
  });

  describe('Single monetary adjustments', () => {
    it('Should be createAdjustment create a new adjustment', async () => {
      const result = await controller.createAdjustment(req, adjustmentDto);
      expect(result).toEqual(outputAdjustment);
    });

    it('Should throw an error if the role does not have the code when trying to create a new adjustment', async () => {
      const adjustmentWithWrongCode = { ...adjustmentDto };
      adjustmentWithWrongCode.transactionCode = 'wrongCode';
      const controllerSpy = jest.spyOn(controller, 'createAdjustment');
      try {
        await controller.createAdjustment(req, adjustmentWithWrongCode);
      } catch (err) {
        expect(err.message).toBe('Bad Request Exception');
        expect(err.response.error).toBe(
          'El código ingresado no coincide con su rol.',
        );
      }
      expect(controllerSpy).toBeCalledTimes(1);
    });

    it('Should be findAll adjustments', async () => {
      const result = await controller.findAll(req, adjustmentQuery);
      expect(result).toEqual(getAdjustmentResponseWithPagination);
    });

    it('Should approve or reject an adjustment by id', async () => {
      const result = await controller.adjustmentValidations(
        adjustmentId,
        adjustmentRejected,
        req,
      );
      expect(result).toEqual(rejectResponseInterface);
    });
    it('Should throw an error if the adjustment is rejected without a comment', async () => {
      const controllerSpy = jest.spyOn(controller, 'adjustmentValidations');

      try {
        await controller.adjustmentValidations(
          adjustmentId,
          adjustmentRejectedWithoutComment,
          reqValidator,
        );
      } catch (err) {
        expect(err.message).toBe('Bad Request Exception');
        expect(err.response.error).toBe('Debes enviar el comentario.');
      }

      expect(controllerSpy).toBeCalledTimes(1);
    });
  });

  describe('Massive monetary adjustments', () => {
    it('Should be createMassiveAdjustment create a new massive adjustment', async () => {
      const result = await controller.createMassiveAdjustment(
        req,
        massiveAdjustmentDto,
      );
      expect(result).toEqual(createMassiveAdjustmentResponse);
    });

    it('Should be find All the massive adjustments files', async () => {
      const result = await controller.findAllMassive(
        reqValidator,
        adjustmentQuery,
      );
      expect(result).toEqual(getAllResponsePaginated);
    });
    it('Should approve or reject a massive adjustment by id', async () => {
      const result = await controller.fileAdjustmentValidations(
        adjustmentId,
        adjustmentRejected,
        reqValidator,
      );
      expect(result).toEqual(rejectResponseInterface);
    });
    it('should return an archive', async () => {
      (service.createArchive as jest.Mock).mockReturnValue(bufferMock);
      const mockResponseArchive: Response = {
        send: sendMock,
        setHeader: setHeaderMock,
      } as unknown as Response;
      await controller.generateArchive(mockResponseArchive, mockParamsArchive);

      expect(setHeaderMock).toHaveBeenCalledWith(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(sendMock).toHaveBeenCalledWith(bufferMock);
    });
    it('should call the service to reprocess file and return empty', async () => {
      const serviceSpy = jest.spyOn(service, 'reprocessFile');
      await controller.reprocessFileAdjustment(adjustmentId);
      expect(serviceSpy).toBeCalledWith(adjustmentId);
    });
  });
  it('should return an AdjustmentStateDto', async () => {
    const result = await controller.countAdjustmentState(req);
    expect(result).toEqual(mockAdjustmentStateDto);
  });
  it('Should obtain the pending individual adjustments according to the roles', async () => {
    const result = await controller.countPendingIndividual(req);
    expect(result).toEqual(1);
  });
  it('Should return paginated adjustments that meet the dto conditions ', async () => {
    const result = await controller.adjustmentReports(searchQuery);
    expect(result).toBeDefined();
    expect(result).toEqual(getReportsPaginated);
  });
  it('should return an archive of reports', async () => {
    (service.createArchive as jest.Mock).mockReturnValue(bufferMock);
    const mockResponseArchive: Response = {
      send: sendMock,
      setHeader: setHeaderMock,
    } as unknown as Response;
    await controller.generateArchiveReport(
      mockResponseArchive,
      mockGetAdjustmentQueryReportsDto,
    );

    expect(setHeaderMock).toHaveBeenCalledWith(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    expect(sendMock).toHaveBeenCalledWith(bufferMock);
  });
});
