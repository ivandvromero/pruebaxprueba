import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { EnrollmentService } from './enrollment.service';
import { Logger } from '@dale/logger-nestjs';
import { of } from 'rxjs';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let http: HttpService;
  const MockEnrollmentReponse = {
    data: {
      data: {
        person: {
          documentType: '2',
          documentNumber: '0123123123',
          expeditionDate: '1996-08-28',
          phonePrefix: '57',
          phoneNumber: '3045245250',
          gender: 2,
        },
        metadata: null,
        deviceInfo: {
          deviceId: '95DCF-5E1F-4DF-A355-2B790899',
          deviceName: 'iPhone 14 Pro',
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
          attempt: 1,
          ipAddress: '127.0.0.1',
        },
      },
    },
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(() => of(MockEnrollmentReponse)),
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
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(http).toBeDefined();
  });

  it('getUserDataByEnrollmentId - Success', async () => {
    const response = await service.getUserDataByEnrollmentId('id');
    expect(response).toBeDefined();
    expect(response).toBe(MockEnrollmentReponse.data.data);
  });

  it('getUserDataByEnrollmentId - Failure', async () => {
    jest.spyOn(http, 'get').mockImplementationOnce(() => {
      throw new Error('test error');
    });
    try {
      await service.getUserDataByEnrollmentId('id');
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerExceptionDale);
    }
  });
});
