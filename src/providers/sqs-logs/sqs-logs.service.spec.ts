import { ConfigurationService } from './../dale/services/configuration.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SqsLogsService } from './sqs-logs.service';
import { Logger } from '@dale/logger-nestjs';

import { sqsHeadersMock } from '../../../test/mock-data';
import { LogTypeEnum, SqsLogTypeEnum } from './enums/log-type.enum';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from 'src/shared/code-erros/error-codes.enum';
import { CreateUserLog } from 'src/modules/user/dto/user.dto';

describe('SqsLogsService', () => {
  let service: SqsLogsService;
  let logger: Logger;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqsLogsService,
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
        {
          provide: ConfigurationService,
          useFactory: () => ({
            getDocumentTypeNameById: jest.fn().mockResolvedValue('CC'),
          }),
        },
      ],
    }).compile();

    service = module.get<SqsLogsService>(SqsLogsService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
  });

  describe('sendMessageLog', () => {
    it('Success event - CREATE_USER', async () => {
      const body: CreateUserLog = {
        attempt: 0,
        documentNumber: '1032490027',
        documentType: '2',
        phone: '3115952183',
        responseIdentifier: '',
      };
      const res = await service.sendMessageLog<CreateUserLog>(
        {
          body,
          data: {
            enrollmentId: '',
          },
          headers: sqsHeadersMock,
          type: LogTypeEnum.SUCCESS,
        },
        SqsLogTypeEnum.CREATE_USER,
        true,
      );
      expect(res).toBeUndefined();
    });

    it('Success event - CREATE_USER - Error', async () => {
      const body = {};
      const res = await service.sendMessageLog<CreateUserLog>(
        {
          body,
          data: {
            enrollmentId: '',
            error: new InternalServerExceptionDale(
              ErrorCodesEnum.MUS005,
              'error',
            ),
          },
          headers: sqsHeadersMock,
          type: LogTypeEnum.ERROR,
        },
        SqsLogTypeEnum.CREATE_USER,
        false,
      );
      expect(res).toBeUndefined();
    });
  });
  it('Event Error - CREATE_USER', async () => {
    const body: CreateUserLog = {
      attempt: 0,
      documentNumber: '1032490027',
      documentType: '2',
      phone: '3115952183',
      responseIdentifier: '',
    };
    jest.spyOn(logger, 'log').mockImplementation(() => {
      throw new Error();
    });
    try {
      await service.sendMessageLog<CreateUserLog>(
        {
          body,
          data: {
            enrollmentId: '',
          },
          headers: sqsHeadersMock,
          type: LogTypeEnum.SUCCESS,
        },
        SqsLogTypeEnum.CREATE_USER,
        true,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerExceptionDale);
    }
  });
});
