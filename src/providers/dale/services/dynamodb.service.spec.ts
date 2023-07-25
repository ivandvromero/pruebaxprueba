import { Logger } from '@dale/logger-nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { mockEventObject } from '../../../../test/mock-data';
import { DynamoDBService } from './dynamodb.service';
import { DynamodbModule, DynamodbService } from '@dale/aws-nestjs';

describe('DynamoDBService', () => {
  let service: DynamoDBService;
  let spyDynamodbService: DynamodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DynamodbModule.forRoot({ tableName: 'Monitor' })],
      providers: [
        DynamoDBService,
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<DynamoDBService>(DynamoDBService);
    spyDynamodbService = module.get<DynamodbService>(DynamodbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(spyDynamodbService).toBeDefined();
  });

  describe('insertMetadata', () => {
    it('Success', async () => {
      const expected = true;
      const mockItem = {
        $metadata: {},
        Count: 1,
        Items: [],
      };
      const mockData = {
        sk: 'EVENT_LOG',
        status: true,
        result: true,
      };
      jest
        .spyOn(spyDynamodbService, 'insertItem')
        .mockImplementation(async () => {
          return mockItem;
        });
      const res = await service.insertMetadata(
        mockEventObject,
        mockData.status,
        mockData.result,
        mockData.sk,
      );
      expect(res).toEqual(expected);
    });

    it('InternalServerExceptionDale', async () => {
      const mockData = {
        sk: 'EVENT_LOG',
        status: true,
        result: true,
      };
      jest
        .spyOn(spyDynamodbService, 'insertItem')
        .mockImplementation(async () => {
          throw new Error('test');
        });
      const result = service.insertMetadata(
        mockEventObject,
        mockData.status,
        mockData.result,
        mockData.sk,
      );
      await expect(result).rejects.toThrowError(InternalServerExceptionDale);
    });
  });

  describe('findSucceededMetadataByPK', () => {
    it('Success with new eventObject', async () => {
      const expected = [];
      const mockItem = {
        $metadata: {},
        Count: 1,
        Items: [],
      };
      jest
        .spyOn(spyDynamodbService, 'findByPK')
        .mockImplementation(async () => {
          return mockItem;
        });
      const mockData = {
        pk: 'id',
        sk: 'EVENT_LOG',
      };
      const res = await service.findSucceededMetadataByPK(
        mockData.pk,
        mockData.sk,
      );
      expect(res).toEqual(expected);
    });
    it('Success with succeeded metadata and status false', async () => {
      const expected = [];
      const mockItem = {
        $metadata: {},
        Count: 1,
        Items: [{ SK: 'EVENT_LOG', Status: false }],
      };
      jest
        .spyOn(spyDynamodbService, 'findByPK')
        .mockImplementation(async () => {
          return mockItem;
        });
      const mockData = {
        pk: 'id',
        sk: 'EVENT_LOG',
      };
      const res = await service.findSucceededMetadataByPK(
        mockData.pk,
        mockData.sk,
      );
      expect(res).toEqual(expected);
    });
    it('Success with succeeded metadata and status true', async () => {
      const expected = [{ SK: 'EVENT_LOG', Status: true }];
      const mockItem = {
        $metadata: {},
        Count: 1,
        Items: [{ SK: 'EVENT_LOG', Status: true }],
      };
      jest
        .spyOn(spyDynamodbService, 'findByPK')
        .mockImplementation(async () => {
          return mockItem;
        });
      const mockData = {
        pk: 'id',
        sk: 'EVENT_LOG',
      };
      const res = await service.findSucceededMetadataByPK(
        mockData.pk,
        mockData.sk,
      );
      expect(res).toEqual(expected);
    });
  });
  describe('getDate', () => {
    it('Success', () => {
      const res = service.getDate();
      expect(res).toBeDefined();
    });
  });
});
