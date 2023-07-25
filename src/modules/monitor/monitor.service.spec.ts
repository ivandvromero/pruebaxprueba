//Libraries
import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';

//Services
import { MonitorService } from './monitor.service';

//Providers
import { ProviderContext } from '../../providers/context/provider-context';
import { DynamoDBService } from '../../providers/dale/services/dynamodb.service';

//Mocks
import { mockEventObject } from '../../../test/mock-data';

//Error
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

describe('MonitorService', () => {
  let service: MonitorService;
  let providerContext: ProviderContext;
  let spyDynamodbService: DynamoDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorService,
        {
          provide: ProviderContext,
          useValue: {
            setStrategy: jest.fn(),
            generateStructure: jest.fn(),
          },
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
        {
          provide: DynamoDBService,
          useValue: {
            insertMetadata: jest.fn(),
            findSucceededMetadataByPK: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MonitorService>(MonitorService);
    providerContext = module.get<ProviderContext>(ProviderContext);
    spyDynamodbService = module.get<DynamoDBService>(DynamoDBService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(providerContext).toBeDefined();
    expect(spyDynamodbService).toBeDefined();
  });
  describe('validateMessageEvent', () => {
    it('Success', async () => {
      const result = await service.validateMessageEvent(mockEventObject);
      expect(result).toEqual(mockEventObject);
    });
    it('InternalServerExceptionDale', async () => {
      const result = service.validateMessageEvent(mockEventObject.RQ);
      await expect(result).rejects.toThrowError(InternalServerExceptionDale);
    });
  });
  describe('getTrama', () => {
    it('Success with new eventObject', async () => {
      const mockItem = [];
      const spyOnGenerateStructure = jest
        .spyOn(providerContext, 'generateStructure')
        .mockReturnValueOnce(Promise.resolve('trama'));
      jest
        .spyOn(spyDynamodbService, 'findSucceededMetadataByPK')
        .mockImplementation(async () => {
          return mockItem;
        });
      jest
        .spyOn(spyDynamodbService, 'insertMetadata')
        .mockImplementation(async () => {
          return true;
        });

      const result = await service.getTrama(mockEventObject);
      expect(spyOnGenerateStructure).toHaveBeenCalled();
      expect(result).toEqual('trama');
    });
    it('Success with succeeded metadata', async () => {
      const mockItem = [{ SK: 'TRAMA', Status: false }];
      const spyOnFindSucceededMetadataByPK = jest
        .spyOn(spyDynamodbService, 'findSucceededMetadataByPK')
        .mockImplementation(async () => {
          return mockItem;
        });

      await service.getTrama(mockEventObject);
      expect(spyOnFindSucceededMetadataByPK).toHaveBeenCalled();
    });
  });
});
