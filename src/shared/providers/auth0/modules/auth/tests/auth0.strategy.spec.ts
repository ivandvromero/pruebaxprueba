import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { Auth0Strategy } from '../auth0.strategy';

export const mockUser = {
  email: 'tester@test.com',
  emailVerified: true,
};

export const mockJwtPayload = {
  payload: {
    iss: process.env.AUTH0_ISSUER_URL,
    sub: 'auth0|123456',
    aud: [process.env.AUTH0_AUDIENCE],
    iat: 1621404749,
    exp: 1621489349,
    azp: '2J6ee6SfOPj27DnR5JsveL1zfXgIDG7K',
    scope: 'openid profile email offline_access',
  },
};

describe('the jwt strategy', () => {
  let testingModule: TestingModule;
  let strategyInstance: Auth0Strategy;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        Auth0Strategy,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(() => ({
              toPromise: () => ({
                data: mockUser,
              }),
            })),
          }),
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'apiConfigAuth'),
          },
        },
      ],
    }).compile();

    strategyInstance = testingModule.get(Auth0Strategy);
  });

  describe('the validate function', () => {
    it('should return the jwt payload', async () => {
      expect(await strategyInstance.validate(mockJwtPayload)).toEqual(
        mockJwtPayload,
      );
    });
  });
});
