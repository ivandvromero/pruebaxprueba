import { RedisService } from './../../../db/redis/redis.service';
import { Logger } from '@dale/logger-nestjs';
import {
  ExternalApiExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { responseError } from '../../../../test/mock-data';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let http: HttpService;
  let cache: RedisService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn(),
            get: jest.fn((x) => {
              if (x.endsWith('2')) {
                return of({
                  data: {
                    data: {
                      provider: [
                        {
                          id: 'PTS',
                          code: 'cedula de ciudadania',
                        },
                      ],
                      shortName: 'CC',
                    },
                  },
                });
              }
            }),
          }),
        },
        {
          provide: RedisService,
          useFactory: () => ({
            getCache: jest.fn(),
            setCache: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
    http = module.get<HttpService>(HttpService);
    cache = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(http).toBeDefined();
  });

  it('Success', async () => {
    const response = await service.getDocumentTypeNameById('2');
    expect(response).toBe('CC');
  });

  it('Error', async () => {
    try {
      jest
        .spyOn(http, 'get')
        .mockReturnValueOnce(throwError(() => responseError));
      await service.getDocumentTypeNameById('abc');
    } catch (error) {
      expect(error).toBeInstanceOf(ExternalApiExceptionDale);
    }
  });

  it('unexpected Error', async () => {
    try {
      responseError.response.data.error = null;
      jest
        .spyOn(http, 'get')
        .mockReturnValueOnce(throwError(() => responseError));
      await service.getDocumentTypeNameById('abc');
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerExceptionDale);
    }
  });
  it('Cache Success', async () => {
    jest.spyOn(cache, 'getCache').mockResolvedValueOnce('CC');
    const response = await service.getDocumentTypeNameById('2');
    expect(response).toBe('CC');
  });
});
