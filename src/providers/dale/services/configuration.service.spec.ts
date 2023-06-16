import { Logger } from '@dale/logger-nestjs';
import {
  ExternalApiExceptionDale,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import {
  responseError,
  responseErrorNotHandled,
} from '../../../../test/mock-data';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let http: HttpService;
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
              if (x.includes('genders')) {
                return of({
                  data: {
                    genders: {
                      id: 1,
                    },
                  },
                });
              }
              if (x.endsWith('2')) {
                return of({
                  data: {
                    provider: [
                      {
                        id: 'PTS',
                        code: 'cedula de ciudadania',
                      },
                    ],
                  },
                });
              }
              if (x.endsWith('0')) {
                throw new Error('Error inesperado');
              }
            }),
          }),
        },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(http).toBeDefined();
  });

  describe('getGenders', () => {
    it('getGenders - Success', async () => {
      const response = await service.getGenders();
      expect(response.genders.id).toEqual(1);
    });

    it('getGenders - Error', async () => {
      jest
        .spyOn(http, 'get')
        .mockReturnValueOnce(throwError(() => responseError));
      try {
        await service.getGenders();
      } catch (error) {
        expect(error).toBeInstanceOf(ExternalApiExceptionDale);
      }
    });

    it('getGenders - unexpected Error', async () => {
      jest
        .spyOn(http, 'get')
        .mockReturnValueOnce(throwError(() => responseErrorNotHandled));
      try {
        await service.getGenders();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });

  describe('getDocumentTypeById', () => {
    it('getDocumentTypeById - Success', async () => {
      const response = await service.getDocumentTypeById('2');
      expect(response.provider[0].id).toEqual('PTS');
    });

    it('getDocumentTypeById - unexpected Error', async () => {
      responseError.response.data.error = null;
      jest
        .spyOn(http, 'get')
        .mockReturnValueOnce(throwError(() => responseError));
      try {
        await service.getDocumentTypeById('0');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });

  describe('getCrmAgreementCode', () => {
    it('getCrmAgreementCode - Success', async () => {
      const mockResponse = {
        data: {
          data: {
            code: '123',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      jest.spyOn(http, 'get').mockImplementationOnce(() => of(mockResponse));
      const response = await service.getCrmAgreementCode('1');
      expect(response).toEqual('123');
    });

    it('getCrmAgreementCode - unexpected Error', async () => {
      jest
        .spyOn(http, 'get')
        .mockReturnValueOnce(throwError(() => responseErrorNotHandled));
      try {
        await service.getCrmAgreementCode('1');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
  describe('getCodeGenderByProvider', () => {
    it(' Success', async () => {
      const mockResponse = {
        data: {
          data: {
            code: '123',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      jest.spyOn(http, 'get').mockImplementationOnce(() => of(mockResponse));
      const response = await service.getCodeGenderByProvider('1', '');
      expect(response).toEqual('123');
    });

    it('unexpected Error', async () => {
      jest
        .spyOn(http, 'get')
        .mockReturnValueOnce(throwError(() => responseErrorNotHandled));
      try {
        await service.getCodeGenderByProvider('', '');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
  });
});
