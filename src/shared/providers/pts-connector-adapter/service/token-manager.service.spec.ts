import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosAdapter } from '@dale/http-adapters/axios-adapter';
import { PtsTokenManager } from './token-manager.service';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { of } from 'rxjs';
import { Logger } from '@dale/logger-nestjs';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

describe('PtsTokenManager', () => {
  let ptsTokenManager: PtsTokenManager;
  let httpService: AxiosAdapter;
  let configService: ConfigService;
  let cacheManager: Cache;

  const tokenMock = 'eyJhbGciOiJSUzUxMiJ9';
  const mockUsername = 'Desarrollo';
  const mockPassword = 'Daledev2022';
  const mockBaseUrl = 'https://api-dale-dev.2innovateit.com/';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PtsTokenManager,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: AxiosAdapter,
          useValue: {
            post: jest.fn().mockResolvedValue({
              access_token: tokenMock,
              expires_in: 2688054053,
            }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useFactory: () => ({
            get: jest.fn().mockImplementation((x) => {
              if (x == `token_pts`) {
                return tokenMock;
              }
              if (x == `token_pts_error`) {
                of();
              }
            }),
            set: jest.fn().mockImplementation((x, y) => {
              if (y == 'token_error') throw new Error('Error inesperado');
              else return tokenMock;
            }),

            del: jest.fn(() => {
              return Promise.resolve();
            }),
          }),
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    ptsTokenManager = module.get<PtsTokenManager>(PtsTokenManager);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<AxiosAdapter>(AxiosAdapter);
    cacheManager = module.get<any>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(ptsTokenManager).toBeDefined();
    expect(configService).toBeDefined();
    expect(httpService).toBeDefined();
    expect(cacheManager).toBeDefined();
  });

  describe('setTokenCache', () => {
    it('setTokenCache - Success', async () => {
      const response = await ptsTokenManager.setTokenCache('token');
      expect(response).toEqual(tokenMock);
    });

    it('setTokenCache - Error', async () => {
      try {
        await ptsTokenManager.setTokenCache('token_error');
      } catch (error) {
        expect(error).toEqual('SET TOKEN');
      }
    });

    it('getToken - Error', async () => {
      try {
        await ptsTokenManager.getToken();
      } catch (error) {
        expect(error.error.code).toEqual(error);
      }
    });

    it('get token and cache returns undefined', async () => {
      jest.spyOn(cacheManager, 'get').mockReturnValue(undefined);
      const response = await ptsTokenManager.getToken();
      expect(response).toEqual(tokenMock);
    });

    it('get token and token is older than actual date', async () => {
      jest.spyOn(cacheManager, 'get').mockReturnValue({
        access_token: tokenMock,
        expires: 12345,
      });
      const response = await ptsTokenManager.getToken();
      expect(response).toEqual(tokenMock);
    });

    it('should throw an error trying to ger the token', async () => {
      jest
        .spyOn(cacheManager, 'get')
        .mockRejectedValue(new Error('something went wrong'));

      await expect(ptsTokenManager.getToken()).rejects.toThrow(
        new InternalServerExceptionDale(
          ErrorCodesEnum.BOS032,
          'Error al obtener token',
        ),
      );
    });
  });

  describe('updateGenerateToken', () => {
    it('should update token and set it in the cache', async () => {
      jest.spyOn(ptsTokenManager, 'generateToken').mockResolvedValue(tokenMock);
      jest
        .spyOn(ptsTokenManager, 'setTokenCache')
        .mockResolvedValueOnce(ptsTokenManager.tokenKey);

      const result = await ptsTokenManager.updateGenerateToken();
      const generate = await ptsTokenManager.generateToken();
      const set = await ptsTokenManager.setTokenCache(tokenMock);

      expect(generate).toBe(tokenMock);
      expect(set).toBe(tokenMock);

      expect(result).toBe(ptsTokenManager.tokenKey);
    });
  });

  it('should generate a token', async () => {
    jest
      .spyOn(configService, 'get')
      .mockReturnValueOnce(mockUsername)
      .mockReturnValueOnce(mockPassword)
      .mockReturnValueOnce(mockBaseUrl);

    const httpMock = jest.spyOn(httpService, 'post').mockResolvedValueOnce({
      data: {
        access_token: ptsTokenManager.tokenKey,
        username: mockUsername,
        password: mockPassword,
      },
    });

    const result = await ptsTokenManager.generateToken();
    expect(httpMock).toHaveBeenCalledWith(
      `${mockBaseUrl}/adaptorOAS/auth/login?grant_type=client_credentials`,
      ptsTokenManager.headersToken,
      null,
      null,
      {
        username: mockUsername,
        password: mockPassword,
      },
    );
    expect(configService.get).toHaveBeenCalledWith('config.pts.user');
    expect(configService.get).toHaveBeenCalledWith('config.pts.password');
    expect(configService.get).toHaveBeenCalledWith('config.pts.baseUrl');
    expect(result).toStrictEqual({ expires: undefined, token: undefined });
  });

  it('should throw an error when trying to generate a token', async () => {
    jest
      .spyOn(configService, 'get')
      .mockReturnValueOnce(mockUsername)
      .mockReturnValueOnce(mockPassword)
      .mockReturnValueOnce(mockBaseUrl);

    jest
      .spyOn(httpService, 'post')
      .mockRejectedValue(new Error('something went wrong'));

    await expect(ptsTokenManager.generateToken()).rejects.toThrow(
      new InternalServerExceptionDale(
        ErrorCodesEnum.BOS034,
        'Error al generar token',
      ),
    );
  });

  it('should delete a token', async () => {
    const delSpy = jest.spyOn(cacheManager, 'del');
    await ptsTokenManager.deleteTokenCache();
    expect(delSpy).toBeCalledTimes(1);
  });

  it('should throw an error when trying to delete a token', async () => {
    jest
      .spyOn(cacheManager, 'del')
      .mockRejectedValue(new Error('something went wrong'));

    await expect(ptsTokenManager.deleteTokenCache()).rejects.toThrow(
      new InternalServerExceptionDale(
        ErrorCodesEnum.BOS035,
        'Error al eliminar el token',
      ),
    );
  });

  describe('onModuleInit', () => {
    it('should update and refresh the token', async () => {
      jest
        .spyOn(ptsTokenManager, 'updateGenerateToken')
        .mockResolvedValueOnce(undefined);

      jest.useFakeTimers();

      await ptsTokenManager.onModuleInit();

      expect(ptsTokenManager.updateGenerateToken).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(60000);
      expect(ptsTokenManager.updateGenerateToken).toHaveBeenCalledTimes(1);
    });
  });
});
