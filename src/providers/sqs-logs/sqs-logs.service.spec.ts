import { Test, TestingModule } from '@nestjs/testing';
import { SqsLogsService } from './sqs-logs.service';
import { CreateAccountLogEventDto } from './dto/create-account-log-event.dto';
import { Logger } from '@dale/logger-nestjs';
import { HeaderSqsDto } from 'src/shared/models/common-header.dto';
import { LogTypeEnum, SqsLogTypeEnum } from './enums/log-type.enum';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { ConfigurationService } from '../dale/services/configuration.service';

describe('SqsLogsService', () => {
  let service: SqsLogsService;
  let logger: Logger;
  let spyConfigService: ConfigurationService;
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
    spyConfigService = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(logger).toBeDefined();
    expect(spyConfigService).toBeDefined();
  });

  describe('sendMessageLog', () => {
    const headers: HeaderSqsDto = {
      transactionId: 'txid',
      channelId: 'chid',
      timestamp: new Date().toISOString(),
      ipAddress: 'ipadress',
      application: 'app',
      'user-agent': 'uesr',
    };
    it('Success event ', async () => {
      const body: CreateAccountLogEventDto = {
        documentNumber: 'cid',
        documentType: 'type',
        mambuId: 'mambuid',
        phone: '32169644',
        ptsId: 'ptsId',
      };
      await service.sendMessageLog<CreateAccountLogEventDto>(
        {
          body,
          data: {
            attempt: 0,
            enrollmentId: 'erlid',
          },
          headers,
          type: LogTypeEnum.SUCCESS,
        },
        SqsLogTypeEnum.CREATE_ACCOUNT,
        true,
      );
      expect(service.publicLogSqs).toHaveBeenCalled;
    });

    it('Error event', async () => {
      const body: CreateAccountLogEventDto = {
        code: '400',
        message: 'error',
      };
      await service.sendMessageLog<CreateAccountLogEventDto>(
        {
          body,
          data: { error: new InternalServerExceptionDale('400', 'test error') },
          headers,
          type: LogTypeEnum.ERROR,
        },
        SqsLogTypeEnum.CREATE_ACCOUNT,
        false,
      );
      expect(service.publicLogSqs).toHaveBeenCalled;
      expect(logger.log).toHaveBeenCalled();
    });

    it('Error event -error', async () => {
      const body: CreateAccountLogEventDto = {
        code: '400',
        message: 'error',
      };
      jest
        .spyOn(spyConfigService, 'getDocumentTypeNameById')
        .mockImplementation(() => {
          throw new Error('test error');
        });
      try {
        await service.sendMessageLog<CreateAccountLogEventDto>(
          {
            body,
            data: {
              error: new InternalServerExceptionDale('400', 'test error'),
            },
            headers,
            type: LogTypeEnum.ERROR,
          },
          SqsLogTypeEnum.CREATE_ACCOUNT,
          false,
        );
      } catch (error) {
        expect(logger.error).toHaveBeenCalled();
      }
    });
  });
});
