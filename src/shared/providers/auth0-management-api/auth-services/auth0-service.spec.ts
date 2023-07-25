import { Test } from '@nestjs/testing';
import { Auth0Service } from './auth0-service';
import {
  authGetEmailsMock,
  authGetRolById,
  authGetRolesMock,
  authGetUsersByIdMock,
  authGetUsersMock,
  mockedRolData,
  tokenMock,
} from '../../../testcases/auth0-testcases';
import { Auth0Connector } from '../connector/auth0-connector';
import { SecretsManager } from '../../../secrets-manager/secrets-manager';
import { BadRequestException } from '@nestjs/common';

describe('MyService', () => {
  let auth0Service: Auth0Service;
  let auth0Connector: Auth0Connector;
  let secretsManager: SecretsManager;
  const mockToken = 'Bearer a313sax21xx214x5';
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Auth0Service,
        {
          provide: Auth0Connector,
          useValue: {
            getAuthToken: jest
              .fn()
              .mockImplementation(() => Promise.resolve(tokenMock)),
            getAuthRoles: jest
              .fn()
              .mockImplementation(() => Promise.resolve(authGetRolesMock)),
          },
        },
        {
          provide: SecretsManager,
          useValue: {},
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn().mockImplementation(),
            set: jest.fn().mockImplementation(),
          },
        },
      ],
    }).compile();

    auth0Service = module.get<Auth0Service>(Auth0Service);
    auth0Connector = module.get<Auth0Connector>(Auth0Connector);
    secretsManager = module.get<SecretsManager>(SecretsManager);
  });

  it('to be definided', () => {
    expect(auth0Service).toBeDefined();
    expect(auth0Connector).toBeDefined();
    expect(secretsManager).toBeDefined();
  });
  describe('getAuthRoles', () => {
    it('should return the result from getAuthRoles', async () => {
      const result = await auth0Service.getAuthRoles();
      expect(result).toEqual(authGetRolesMock);
    });
  });

  describe('getUserByIdRol', () => {
    const id = 'auth0|63ee470ff075ab024c202929';
    it('should return the result from getUserByIdRol', async () => {
      jest
        .spyOn(auth0Service, 'getUserByIdRol')
        .mockResolvedValue(authGetUsersByIdMock);
      const result = await auth0Service.getUserByIdRol(id);
      expect(result).toEqual(authGetUsersByIdMock);
    });
    it('should throw BadRequestException if an error occurs', async () => {
      jest.spyOn(auth0Service, 'getAuthToken').mockResolvedValue(mockToken);
      await expect(auth0Service.getUserByIdRol(id)).rejects.toThrowError(
        new BadRequestException('BOS027'),
      );
    });
  });

  describe('getRolById', () => {
    const id = 'auth0|63ee470ff075ab024c202929';
    it('should return the result from getRolById', async () => {
      jest.spyOn(auth0Service, 'getRolById').mockResolvedValue(mockedRolData);
      const result = await auth0Service.getRolById(id);
      expect(result).toEqual([authGetRolById]);
    });
    it('should throw BadRequestException if an error occurs', async () => {
      jest.spyOn(auth0Service, 'getAuthToken').mockResolvedValue(mockToken);
      await expect(auth0Service.getRolById(id)).rejects.toThrowError(
        new BadRequestException('BOS028'),
      );
    });
  });

  describe('getEmailByParams', () => {
    it('should return the result from getEmailByParams', async () => {
      const name = ['Juan capturador'];
      const mockedRoles = [
        {
          id: 'auth0|63ee470ff075ab024c202929',
          name: 'Juan capturador',
          description: 'info',
        },
        {
          id: 'auth0|63ee470ff075ab024c202929',
          name: 'user2',
          description: 'data',
        },
      ];

      jest.spyOn(auth0Service, 'getAuthRoles').mockResolvedValue(mockedRoles);
      jest.spyOn(auth0Service, 'getRolById').mockResolvedValue(mockedRolData);
      jest
        .spyOn(auth0Service, 'getAllUsers')
        .mockResolvedValue(authGetUsersMock);
      const result = await auth0Service.getEmailByParams(name);
      expect(result).toEqual(authGetEmailsMock);
    });
    it('should throw BadRequestException if an error occurs', async () => {
      const name = ['Juan capturador'];
      jest.spyOn(auth0Service, 'getAuthToken').mockResolvedValue(mockToken);
      await expect(auth0Service.getEmailByParams(name)).rejects.toThrowError(
        new BadRequestException('BOS029'),
      );
    });
  });
  describe('getAllUsers', () => {
    it('should return cached users if available', async () => {
      jest.spyOn(auth0Service, 'getAuthToken').mockResolvedValueOnce(mockToken);
      jest
        .spyOn(auth0Service, 'getAllUsers')
        .mockResolvedValue(authGetUsersMock);

      const result = await auth0Service.getAllUsers();
      expect(result).toEqual(authGetUsersMock);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      jest.spyOn(auth0Service, 'getAuthToken').mockResolvedValue(mockToken);
      await expect(auth0Service.getAllUsers()).rejects.toThrowError(
        new BadRequestException('BOS031'),
      );
    });
  });
});
