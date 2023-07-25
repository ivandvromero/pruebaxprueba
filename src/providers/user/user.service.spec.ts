//Libraries
import { of, throwError } from 'rxjs';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, CACHE_MANAGER } from '@nestjs/common';

//Mock Data
import {
  accountNumber,
  getUserErrorResponse,
  internalServerExceptionResponse,
  configurationGetUserByAccountNumberResponseDecrypt,
  dataRedisEncrypt,
} from '../../../test/mock-data';

//Services
import { UserService } from './user.service';

//Error Handling
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

//Secrets Managers
import { SecretsManager } from '../../shared/secrets-manager/secrets-manager';

describe('UserService', () => {
  let service: UserService;
  let spyHttpService: HttpService;
  let cacheManager: Cache;
  let secretManager: SecretsManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(() =>
              of(configurationGetUserByAccountNumberResponseDecrypt),
            ),
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
            cacheManagerDecrypt: jest
              .fn()
              .mockReturnValue(
                configurationGetUserByAccountNumberResponseDecrypt,
              ),
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
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
  describe('UserService', () => {
    describe('getUser', () => {
      it('Success with cache data', async () => {
        const result = await service.getUser(accountNumber);
        expect(result).toEqual(
          configurationGetUserByAccountNumberResponseDecrypt,
        );
      });
      it('Success without cache data', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        const result = await service.getUser(accountNumber);
        expect(result).toEqual(
          configurationGetUserByAccountNumberResponseDecrypt.data,
        );
      });

      it('CustomException', async () => {
        jest
          .spyOn(spyHttpService, 'get')
          .mockReturnValueOnce(
            throwError(() => internalServerExceptionResponse),
          );
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
        try {
          await service.getUser(accountNumber);
        } catch (e) {
          expect(e.response.code).toEqual('MON019');
          expect(e).toBeInstanceOf(CustomException);
        }
      });
      it('ExternalApiExceptionDale', async () => {
        jest
          .spyOn(secretManager, 'cacheManagerDecrypt')
          .mockRejectedValue(throwError(() => new Error('test')));
        await expect(service.getUser(accountNumber)).rejects.toThrowError(
          InternalServerExceptionDale,
        );
      });
    });

    it('CustomException NOT_FOUND', async () => {
      jest
        .spyOn(spyHttpService, 'get')
        .mockImplementationOnce(() => of(getUserErrorResponse));
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(null);
      try {
        await service.getUser(accountNumber);
      } catch (e) {
        expect(e.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });
  });
});
