import { Cache } from 'cache-manager';
import { of, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CardService } from './card.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCardBasic,
  dataRedisEncrypt,
  userId,
  internalServerExceptionResponse,
  getCardBasicResponseNotFound,
} from '../../../test/mock-data';
import { CACHE_MANAGER } from '@nestjs/common';
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

describe('CardService', () => {
  let service: CardService;
  let spyOnHttpService: HttpService;
  let spyOnCacheManager = Cache;
  let spyOnSecretManager: SecretsManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(() => of(mockCardBasic)),
          }),
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockReturnValue(dataRedisEncrypt),
            set: jest.fn(),
          },
        },
        {
          provide: SecretsManager,
          useFactory: () => ({
            cacheManagerEncrypt: jest.fn().mockReturnValue(dataRedisEncrypt),
            cacheManagerDecrypt: jest.fn().mockReturnValue(mockCardBasic),
          }),
        },
      ],
    }).compile();
    service = module.get<CardService>(CardService);
    spyOnHttpService = module.get<HttpService>(HttpService);
    spyOnCacheManager = module.get<Cache>(CACHE_MANAGER);
    spyOnSecretManager = module.get<SecretsManager>(SecretsManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(spyOnHttpService).toBeDefined();
    expect(spyOnCacheManager).toBeDefined();
    expect(spyOnSecretManager).toBeDefined();
  });

  describe('getCardAddress', () => {
    it('Success with cache data', async () => {
      const result = await service.getCardAddress(userId);
      expect(result).toEqual(mockCardBasic);
    });

    it('Success without cache data', async () => {
      jest.spyOn(spyOnCacheManager, 'get').mockResolvedValueOnce(null);
      const result = await service.getCardAddress(userId);
      expect(result).toEqual(mockCardBasic.data);
    });

    it('CustomException', async () => {
      jest
        .spyOn(spyOnHttpService, 'get')
        .mockReturnValueOnce(throwError(() => internalServerExceptionResponse));
      jest.spyOn(spyOnCacheManager, 'get').mockResolvedValueOnce(null);
      try {
        await service.getCardAddress(userId);
      } catch (e) {
        expect(e.response.code).toEqual('MON019');
        expect(e).toBeInstanceOf(CustomException);
      }
    });

    it('ExternalApiExceptionDale', async () => {
      jest
        .spyOn(spyOnSecretManager, 'cacheManagerDecrypt')
        .mockRejectedValue(throwError(() => new Error('test')));
      await expect(service.getCardAddress(userId)).rejects.toThrowError(
        InternalServerExceptionDale,
      );
    });

    it('Card NOT_FOUND', async () => {
      jest
        .spyOn(spyOnHttpService, 'get')
        .mockImplementationOnce(() => of(getCardBasicResponseNotFound));
      jest.spyOn(spyOnCacheManager, 'get').mockResolvedValueOnce(null);
      const result = await service.getCardAddress(userId);
      expect(result).toEqual(getCardBasicResponseNotFound.data);
    });
  });
});
