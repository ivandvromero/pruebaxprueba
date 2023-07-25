import { Test, TestingModule } from '@nestjs/testing';
import { Auth0Connector } from './auth0-connector';
import { AxiosAdapter } from '@dale/http-adapters/axios-adapter';
import { ConfigService } from '@nestjs/config';
import {
  authGetRolById,
  authGetRolesMock,
  authGetUsersMock,
  authTokenMock,
} from '@dale/testcases/auth0-testcases';

describe('Auth0Connector', () => {
  let auth0Connector: Auth0Connector;
  let configService: ConfigService;
  let http: AxiosAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Auth0Connector,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'apiConfigPts'),
          },
        },
        {
          provide: AxiosAdapter,
          useValue: {
            get: jest.fn().mockImplementation(() => Promise.resolve()),
            post: jest.fn().mockImplementation(() => Promise.resolve([])),
          },
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    http = module.get<AxiosAdapter>(AxiosAdapter);
    auth0Connector = module.get<Auth0Connector>(Auth0Connector);
  });

  it('should be defined', () => {
    expect(auth0Connector).toBeDefined();
    expect(configService).toBeDefined();
    expect(http).toBeDefined();
  });

  describe('getAuthRoles', () => {
    it('should return the result from getAuthRoles', async () => {
      const mockToken = 'Bearer a313sax21xx214x5';
      jest.spyOn(http, 'get').mockResolvedValue(authGetRolesMock);
      const result = await auth0Connector.getAuthRoles(mockToken);
      expect(result).toBeDefined();
    });
  });

  describe('getAuthUsers', () => {
    it('should return the result from getAuthUsers', async () => {
      const mockToken = 'Bearer a313sax21xx214x5';
      jest.spyOn(http, 'get').mockResolvedValue(authGetUsersMock);
      const result = await auth0Connector.getAuthUsers(mockToken);
      expect(result).toBeDefined();
    });
  });

  describe('getAuthToken', () => {
    it('should return the result from getAuthToken', async () => {
      jest.spyOn(http, 'post').mockResolvedValue(authTokenMock);
      const result = await auth0Connector.getAuthToken();
      expect(result).toBeDefined();
    });
  });

  describe('getRolById', () => {
    it('should return the result from getRolById', async () => {
      const mockToken = 'Bearer a313sax21xx214x5';
      const id = 'auth0|63ee470ff075ab024c202929';
      jest.spyOn(http, 'get').mockResolvedValue(authGetRolById);
      const result = await auth0Connector.getRolById(id, mockToken);
      expect(result).toBeDefined();
    });
  });

  describe('getUserByIdRol', () => {
    it('should return the result from getUserByIdRol', async () => {
      const mockToken = 'Bearer a313sax21xx214x5';
      const id = 'sad22222qada2';
      jest.spyOn(http, 'get').mockResolvedValue(authGetUsersMock);
      const result = await auth0Connector.getUserByIdRol(id, mockToken);
      expect(result).toBeDefined();
    });
  });
  describe('getAllUser', () => {
    it('should return the result from getUserByIdRol', async () => {
      const mockToken = 'Bearer a313sax21xx214x5';
      jest.spyOn(http, 'get').mockResolvedValue(authGetUsersMock);
      const result = await auth0Connector.getAllUsers(mockToken, 0);
      expect(result).toBeDefined();
    });
  });
});
