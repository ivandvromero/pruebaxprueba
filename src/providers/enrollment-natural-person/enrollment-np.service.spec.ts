//Libraries
import { of, throwError } from 'rxjs';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  headers,
  dataRedisEncrypt,
  externalExceptionResponse,
  internalServerExceptionResponse,
  ConfigurationGetEnrollmentDeviceByIdResponseDecrypt,
} from '../../../test/mock-data';

//Services
import { EnrollmentNaturalPersonService } from './enrollment-np.service';

//Error Handling
import {
  CustomException,
  ExternalApiExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

//Secrets Managers
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';

describe('EnrollmentNaturalPersonService', () => {
  let service: EnrollmentNaturalPersonService;
  let spyHttpService: HttpService;
  let cacheManager: Cache;
  let secretManager: SecretsManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentNaturalPersonService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockReturnValue(dataRedisEncrypt),
            set: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(() =>
              of(ConfigurationGetEnrollmentDeviceByIdResponseDecrypt),
            ),
          }),
        },
        {
          provide: SecretsManager,
          useFactory: () => ({
            cacheManagerEncrypt: jest.fn().mockReturnValue(dataRedisEncrypt),
            cacheManagerDecrypt: jest
              .fn()
              .mockReturnValue(
                ConfigurationGetEnrollmentDeviceByIdResponseDecrypt,
              ),
          }),
        },
      ],
    }).compile();

    service = module.get<EnrollmentNaturalPersonService>(
      EnrollmentNaturalPersonService,
    );
    spyHttpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    secretManager = module.get<SecretsManager>(SecretsManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(spyHttpService).toBeDefined();
    expect(cacheManager).toBeDefined();
    expect(secretManager).toBeDefined();
  });

  describe('getDeviceInformation', () => {
    it('Success with cache data', async () => {
      const result = await service.getDeviceInformation(id, headers);
      expect(result).toEqual(
        ConfigurationGetEnrollmentDeviceByIdResponseDecrypt,
      );
    });

    it('Success without cache data', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      const result = await service.getDeviceInformation(id, headers);
      expect(result).toEqual(
        ConfigurationGetEnrollmentDeviceByIdResponseDecrypt.data,
      );
    });

    it('CustomException', async () => {
      jest
        .spyOn(spyHttpService, 'get')
        .mockReturnValueOnce(throwError(() => internalServerExceptionResponse));
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      try {
        await service.getDeviceInformation(id, headers);
      } catch (e) {
        expect(e.response.code).toEqual('MON017');
        expect(e).toBeInstanceOf(CustomException);
      }
    });

    it('InternalServerExceptionDale', async () => {
      jest
        .spyOn(secretManager, 'cacheManagerDecrypt')
        .mockRejectedValue(throwError(() => new Error('test')));
      await expect(
        service.getDeviceInformation(id, headers),
      ).rejects.toThrowError(InternalServerExceptionDale);
    });
  });

  describe('httpGet', () => {
    it('ExternalException', async () => {
      jest
        .spyOn(spyHttpService, 'get')
        .mockReturnValueOnce(throwError(() => externalExceptionResponse));
      try {
        await service.httpGet(id, headers);
      } catch (e) {
        expect(e).toBeInstanceOf(ExternalApiExceptionDale);
      }
    });
  });
});
