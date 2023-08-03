import { Test, TestingModule } from '@nestjs/testing';
import { AdlService } from './adl.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { of } from 'rxjs';
import { ErrorCustomizer } from '../../utils/customize-error';
import { Logger } from '@dale/logger-nestjs';
import {
  adlCheckTrxInputMock,
  adlCheckTrxOutputMock,
  adlCheckTrxReportInputMock,
  adlCheckTrxReportOutputMock,
} from '../../../test/mock-data';
import * as rxjs from 'rxjs';
import {
  BadRequestExceptionDale,
  InternalServerExceptionDale,
  OkExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../../src/shared/code-errors/error-codes.enum';

describe('AdlService', () => {
  let adlService: AdlService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdlService,
        {
          provide: CACHE_MANAGER,
          useFactory: () => ({
            get: jest.fn().mockImplementation((x) => {
              if (x == `token_adl`) {
                return 'TOKEN LOL';
              }
              if (x == `token_adl_error`) {
                of();
              }
            }),
            set: jest.fn().mockImplementation((y) => {
              if (y == 'token_error') throw new Error('Error inesperado');
              else return 'SET TOKEN';
            }),
            del: jest.fn(),
          }),
        },
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn((y) => {
              if (y == null) {
                return of({
                  data: {
                    access_token: 'token',
                  },
                });
              }
            }),
            get: jest.fn(() =>
              of({
                data: {},
              }),
            ),
            updateGenerateToken: jest.fn(),
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          }),
        },
        ErrorCustomizer,
      ],
    }).compile();
    adlService = module.get<AdlService>(AdlService);
  });

  describe('generateToken', () => {
    it('generateToken - Success', async () => {
      const response = await adlService.generateTokenAdl();
      expect(response).toEqual(undefined);
    });
  });

  describe('set Token Cache ADL', () => {
    it('set Token Cache Success', async () => {
      const response = await adlService.setTokenCacheAdl('token');
      expect(response).toEqual('SET TOKEN');
    });

    it('set Token Cache ADL Error', async () => {
      try {
        await adlService.setTokenCacheAdl('token_error');
      } catch (error) {
        expect(error).toEqual('SET TOKEN');
      }
    });

    it('update Generate Token ADL Success', async () => {
      const response = await adlService.updateGenerateToken();
      expect(response).toEqual('SET TOKEN');
    });
  });

  describe('ADL', () => {
    it('checkTrx - Success', async () => {
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockResolvedValue(adlCheckTrxOutputMock);
      const response = await adlService.checkTrx(adlCheckTrxInputMock);
      expect(response).toEqual(undefined);
    });
    it('checkTrxReport - Success', async () => {
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockResolvedValue(adlCheckTrxReportOutputMock);
      const response = await adlService.checkTrxReport(
        adlCheckTrxReportInputMock,
      );
      expect(response).toEqual(undefined);
    });
    it('checkTrx - Error', async () => {
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockImplementation(() =>
          Promise.reject(new OkExceptionDale(ErrorCodesEnum.ACN017, 'error')),
        );
      try {
        await adlService.checkTrx(adlCheckTrxInputMock);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
    it('checkTrxReport - Error', async () => {
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockImplementation(() =>
          Promise.reject(new OkExceptionDale(ErrorCodesEnum.ACN017, 'error')),
        );
      try {
        await adlService.checkTrxReport(adlCheckTrxReportInputMock);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerExceptionDale);
      }
    });
    it('checkTrx - Error 400', async () => {
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockImplementation(() =>
          Promise.reject(
            new BadRequestExceptionDale(ErrorCodesEnum.ACN017, 'error'),
          ),
        );
      try {
        await adlService.checkTrx(adlCheckTrxInputMock);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
    it('checkTrxReport - Error 400', async () => {
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockImplementation(() =>
          Promise.reject(
            new BadRequestExceptionDale(ErrorCodesEnum.ACN017, 'error'),
          ),
        );
      try {
        await adlService.checkTrxReport(adlCheckTrxReportInputMock);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestExceptionDale);
      }
    });
  });
});
