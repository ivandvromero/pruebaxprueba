import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { Cache } from 'cache-manager';

// Services
import { CrmService } from './crm.service';

// Mock Data
import {
  crmGetClient,
  crmGetProduct,
  dataRedisEncrypt,
  externalId,
  internalServerExceptionResponse,
} from '../../../test/mock-data';

//Error Handling
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

//Secrets Managers
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';

describe('CrmServices', () => {
  let crmServices: CrmService;
  let httpService: HttpService;
  let cacheManager: Cache;
  let secretManager: SecretsManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrmService,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(() => of(crmGetClient)),
          }),
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: SecretsManager,
          useFactory: () => ({
            cacheManagerEncrypt: jest.fn().mockReturnValue(dataRedisEncrypt),
            cacheManagerDecrypt: jest.fn().mockReturnValue(crmGetClient),
          }),
        },
      ],
    }).compile();

    crmServices = module.get<CrmService>(CrmService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    secretManager = module.get<SecretsManager>(SecretsManager);
  });

  it('should be defined', () => {
    expect(crmServices).toBeDefined();
    expect(httpService).toBeDefined();
    expect(cacheManager).toBeDefined();
    expect(secretManager).toBeDefined();
  });

  describe('getClientOrigin', () => {
    it('Success endPoint ', async () => {
      const result = await crmServices.getClientOrigin(externalId);
      expect(result).toEqual(crmGetClient.data);
    });

    it('Success Cache ', async () => {
      const spyOnCachemanager = jest
        .spyOn(cacheManager, 'get')
        .mockImplementationOnce(() => Promise.resolve(crmGetClient));

      const result = await crmServices.getClientOrigin(externalId);
      expect(spyOnCachemanager).toHaveBeenCalled();
      expect(result).toEqual(crmGetClient);
    });

    it('Error InternalServerException', async () => {
      jest
        .spyOn(cacheManager, 'get')
        .mockRejectedValueOnce(throwError(() => new Error('test')));
      await expect(
        crmServices.getClientOrigin(externalId),
      ).rejects.toThrowError(InternalServerExceptionDale);
    });
    it('CustomException', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => internalServerExceptionResponse));
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      await expect(
        crmServices.getClientOrigin(externalId),
      ).rejects.toThrowError(CustomException);
    });
  });

  describe('getClientDestination', () => {
    it('Success endPoint ', async () => {
      const result = await crmServices.getClientDestination(externalId);
      expect(result).toEqual(crmGetClient.data);
    });

    it('Success Cache ', async () => {
      const spyOnCachemanager = jest
        .spyOn(cacheManager, 'get')
        .mockImplementationOnce(() => Promise.resolve(crmGetClient));

      const result = await crmServices.getClientDestination(externalId);
      expect(spyOnCachemanager).toHaveBeenCalled();
      expect(result).toEqual(crmGetClient);
    });

    it('Error InternalServerException', async () => {
      jest
        .spyOn(cacheManager, 'get')
        .mockRejectedValueOnce(throwError(() => new Error('test')));
      await expect(
        crmServices.getClientDestination(externalId),
      ).rejects.toThrowError(InternalServerExceptionDale);
    });
    it('CustomException', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => internalServerExceptionResponse));
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      await expect(
        crmServices.getClientDestination(externalId),
      ).rejects.toThrowError(CustomException);
    });
  });

  describe('getProductOrigin', () => {
    it('Success endPoint ', async () => {
      const client = { clientOrigin: { Field_K7_0001: '' } };
      const spyOnHttpService = jest
        .spyOn<HttpService, any>(httpService, 'get')
        .mockReturnValueOnce(of(crmGetProduct));
      jest
        .spyOn(secretManager, 'cacheManagerDecrypt')
        .mockResolvedValueOnce(crmGetProduct);

      const result = await crmServices.getProductOrigin(externalId, client);
      expect(result).toEqual(crmGetProduct.data);
      expect(spyOnHttpService).toHaveBeenCalled();
    });

    it('Success Cache ', async () => {
      const spyOnCachemanager = jest
        .spyOn(cacheManager, 'get')
        .mockImplementationOnce(() => Promise.resolve(crmGetProduct));
      jest
        .spyOn(secretManager, 'cacheManagerDecrypt')
        .mockResolvedValueOnce(crmGetProduct);

      const result = await crmServices.getProductOrigin(
        externalId,
        crmGetClient.data.links,
      );
      expect(result).toEqual(crmGetProduct);
      expect(spyOnCachemanager).toHaveBeenCalled();
    });

    it('Error InternalServerException', async () => {
      jest
        .spyOn(cacheManager, 'get')
        .mockRejectedValueOnce(throwError(() => new Error('test')));
      await expect(
        crmServices.getProductOrigin(externalId, crmGetClient.data.links),
      ).rejects.toThrowError(InternalServerExceptionDale);
    });
    it('CustomException', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => internalServerExceptionResponse));
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      await expect(
        crmServices.getProductOrigin(externalId, crmGetClient.data.links),
      ).rejects.toThrowError(CustomException);
    });
  });

  describe('getProductDestination', () => {
    it('Success endPoint ', async () => {
      const client = { clientDestination: { Field_K7_0031: '' } };
      const spyOnHttpService = jest
        .spyOn<HttpService, any>(httpService, 'get')
        .mockReturnValueOnce(of(crmGetProduct));

      const result = await crmServices.getProductDestination(
        externalId,
        client,
      );
      expect(result).toEqual(crmGetProduct.data);
      expect(spyOnHttpService).toHaveBeenCalled();
    });

    it('Success Cache ', async () => {
      const spyOnCachemanager = jest
        .spyOn(cacheManager, 'get')
        .mockImplementationOnce(() => Promise.resolve(crmGetProduct));
      jest
        .spyOn(secretManager, 'cacheManagerDecrypt')
        .mockResolvedValueOnce(crmGetProduct);

      const result = await crmServices.getProductDestination(
        externalId,
        crmGetClient.data.links,
      );
      expect(result).toEqual(crmGetProduct);
      expect(spyOnCachemanager).toHaveBeenCalled();
    });

    it('Error InternalServerException', async () => {
      jest
        .spyOn(cacheManager, 'get')
        .mockRejectedValueOnce(throwError(() => new Error('test')));
      await expect(
        crmServices.getProductDestination(externalId, crmGetClient.data.links),
      ).rejects.toThrowError(InternalServerExceptionDale);
    });
    it('CustomException', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => internalServerExceptionResponse));
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      await expect(
        crmServices.getProductDestination(externalId, crmGetClient.data.links),
      ).rejects.toThrowError(CustomException);
    });
  });
});
