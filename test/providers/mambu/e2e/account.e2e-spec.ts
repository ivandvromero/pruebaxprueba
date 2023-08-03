import 'shared/config/env/env.config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AccountServiceModule } from '../../../../src/account-service.module';
import {
  mockAccountResponse,
  mockClientId,
  mockAccountId,
  mockCreateAccountData,
  mockDepositAccountResponse,
} from '../../../mock-data';
import { Logger } from '@dale/logger-nestjs';
import { SERVICE_NAME } from '../../../../src/constants/common';
import { AuditInterceptor } from '@dale/shared-nestjs/utils/audit/audit-interceptor';

describe('Account Service (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountServiceModule],
    })
      .overrideProvider(Logger)
      .useValue(new Logger({ context: __filename, level: 'silent' }))
      .compile();

    app = moduleFixture.createNestApplication();
    if (process.env.ENABLE_AUDIT === 'true') {
      app.useGlobalInterceptors(new AuditInterceptor(SERVICE_NAME));
    }
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST account route', () => {
    it('should create a new account for user', async () => {
      return request(app.getHttpServer())
        .post('/account')
        .send(mockCreateAccountData)
        .expect(201);
    });
  });

  describe('GET deposit account route with client id', () => {
    it('should fetch deposit account details with client id', async () => {
      return request(app.getHttpServer())
        .get(`/account`)
        .query({ clientId: mockClientId })
        .expect(200)
        .expect((res) => {
          // checking only the first instance since, each time a new account is created for the client, expected response changes
          expect(JSON.parse(res.text)[0]).toEqual(mockAccountResponse);
        });
    });
  });

  describe('GET deposit account route with account id', () => {
    it('should fetch deposit account details with account id', async () => {
      return request(app.getHttpServer())
        .get(`/account/${mockAccountId}`)
        .expect(200)
        .expect((res) => {
          expect(JSON.parse(res.text)).toEqual({
            ...mockDepositAccountResponse,
            clientId: mockClientId,
          });
        });
    });
  });

  describe('GET account numbers with clientId route', () => {
    it('should fetch the account numbers with clientId', async () => {
      return request(app.getHttpServer())
        .get('/account/account-numbers')
        .query({ externalCustomerId: mockClientId })
        .expect(200)
        .expect((res) => {
          expect(JSON.parse(res.text)).toHaveProperty('accountNumbers');
        });
    });
  });

  describe('health route', () => {
    it('should return 200 ok for the health controller', async () => {
      return request(app.getHttpServer()).get('/service/health').expect(200);
    });
  });
});
