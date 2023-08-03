import { Test, TestingModule } from '@nestjs/testing';
import { PtsService } from './pts.service';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, CACHE_MANAGER } from '@nestjs/common';
import { of } from 'rxjs';
import { ErrorCustomizer } from '../../utils/customize-error';
import { Logger } from '@dale/logger-nestjs';
import {
  BadRequestExceptionDale,
  CustomException,
  OkExceptionDale,
} from '@dale/manage-errors-nestjs';
import {
  mockPtsResponse,
  mockHeaderDto,
  mockModifyLimitsBody,
  mockPermittedModificationsResponse,
  mockModifyLimitsResponse,
} from '../../../test/mock-data';

describe('PtsService', () => {
  let service: PtsService;
  let spyHttpService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PtsService,
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn((x, y) => {
              if (y == null) {
                return of({
                  data: {
                    access_token: 'token',
                  },
                });
              }
              const phoneNumber =
                y.messageRQ.account.othersId[0].identificationId;
              if (phoneNumber == '506-287-2595')
                return of({
                  data: 'exito',
                });
              if (phoneNumber == '506-287-2597')
                throw new BadRequestException({
                  data: {
                    statusRS: {
                      code: '-2407',
                    },
                  },
                });
              if (phoneNumber == '506-287-2598')
                throw new BadRequestException({
                  data: {
                    statusRS: {
                      code: '-2000',
                    },
                  },
                });
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
          provide: CACHE_MANAGER,
          useFactory: () => ({
            get: jest.fn().mockImplementation((x) => {
              if (x == `token_pts`) {
                return 'TOKEN LOL';
              }
              if (x == `token_pts_error`) {
                of();
              }
              if (x == `modifyLimits:accum1234`) {
                return 3;
              }
            }),
            set: jest.fn().mockImplementation((x, y) => {
              if (y == 'token_error') throw new Error('Error inesperado');
              else return 'SET TOKEN';
            }),
            del: jest.fn(),
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
    service = module.get<PtsService>(PtsService);
    spyHttpService = module.get(HttpService);
  });

  describe('generateToken', () => {
    it('generateToken - Success', async () => {
      const response = await service.generateToken();
      expect(response).toEqual('token');
    });
  });

  describe('setTokenCache', () => {
    it('setTokenCache - Success', async () => {
      const response = await service.setTokenCache('token');
      expect(response).toEqual('SET TOKEN');
    });

    it('setTokenCache - Error', async () => {
      try {
        await service.setTokenCache('token_error');
      } catch (error) {
        expect(error).toEqual('SET TOKEN');
      }
    });

    it('updateGenerateToken - Success', async () => {
      const response = await service.updateGenerateToken();
      expect(response).toEqual('SET TOKEN');
    });

    it('getToken - Success', async () => {
      const response = await service.getToken(`token_pts`);
      expect(response).toEqual('TOKEN LOL');
    });

    it('getToken - Error', async () => {
      try {
        const response = await service.getToken(`token_pts_error`);
      } catch (error) {
        expect(error.error.code).toEqual('ACS003');
      }
    });

    it('get - Success', async () => {
      const response = await service.get('');
      expect(response).toEqual({});
    });
  });

  describe('Create Account', () => {
    const request = {
      userId: '',
      bPartnerId: '',
      customerExternalId: '',
      phoneNumber: '',
      enrollmentId: '',
      customerExternalNumber: '',
    };

    it('Create Account - Success', async () => {
      request.phoneNumber = '506-287-2595';
      const response = await service.createAccount(request);
      expect(response).toEqual('exito');
    });

    it('Create Account - Error', async () => {
      try {
        request.phoneNumber = '506-287-2597';
        await service.createAccount(request);
      } catch (error) {
        expect(error).toBeInstanceOf(CustomException);
      }
    });

    it('Create Account - Error default', async () => {
      try {
        request.phoneNumber = '506-287-2598';
        await service.createAccount(request);
      } catch (error) {
        expect(error).toBeInstanceOf(CustomException);
      }
    });
  });

  describe('Modify Limits', () => {
    afterAll(() => {
      spyHttpService.post.mockClear();
    });
    it('Modify Limits - Success Cache', async () => {
      jest
        .spyOn(spyHttpService, 'post')
        .mockImplementationOnce(() => of(mockPtsResponse));

      const result = await service.modifyLimits(
        mockModifyLimitsBody,
        mockHeaderDto,
      );

      expect(result).toEqual(mockModifyLimitsResponse.data);
    });

    it('Modify Limits - Permitted modifications', async () => {
      const mockBody = { ...mockModifyLimitsBody };
      mockBody.accountId = '1234';
      const result = await service.modifyLimits(mockBody, mockHeaderDto);

      expect(result).toEqual(mockPermittedModificationsResponse.data);
    });

    it('Modify Limits - Error BadRequestExceptionDale', async () => {
      jest.spyOn(spyHttpService, 'post').mockImplementationOnce(() => {
        throw new BadRequestException({
          status: 400,
        });
      });

      await expect(
        service.modifyLimits(mockModifyLimitsBody, mockHeaderDto),
      ).rejects.toThrowError(BadRequestExceptionDale);
    });

    it('Modify Limits - Error OkExceptionDale', async () => {
      jest.spyOn(spyHttpService, 'post').mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      await expect(
        service.modifyLimits(mockModifyLimitsBody, mockHeaderDto),
      ).rejects.toThrowError(OkExceptionDale);
    });
  });
});
