import {
  mambuTransactionChanelsMock,
  transactionChanelsMock,
} from '../src/shared/testcases/client-testcases';
import { AxiosAdapter } from '../src/client/modules/driven-adapters/http-adapters/axios-adapter';
import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ClientModule } from '../src/client/client.module';
import { Auth0Guard } from '@dale/exceptions/providers/auth0/modules/auth.guard';
import { PermissionsGuard } from '@dale/exceptions/providers/auth0/modules/permission.guard';
import { Auth0Module } from '../src/shared/providers/auth0/modules/auth0.module';

describe('ClientController (e2e)', () => {
  let app: INestApplication;
  const http = {
    get: jest.fn(),
    post: jest.fn(),
  };
  beforeEach(async () => {
    const mockTokenGuard: CanActivate = { canActivate: jest.fn(() => true) };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ClientModule, Auth0Module],
    })
      .overrideGuard(Auth0Guard)
      .useValue(mockTokenGuard)
      .overrideGuard(PermissionsGuard)
      .useValue(mockTokenGuard)
      .overrideProvider(AxiosAdapter)
      .useValue(http)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('/client/transactionCode (GET)', () => {
    jest.spyOn(http, 'get').mockResolvedValue(mambuTransactionChanelsMock);
    return request(app.getHttpServer())
      .get('/client/transactionCode')
      .expect(200)
      .expect({ transactionChannel: transactionChanelsMock });
  });

  afterAll(async () => {
    await app.close();
  });
});
