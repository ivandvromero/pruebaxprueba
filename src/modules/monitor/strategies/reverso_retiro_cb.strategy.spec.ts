//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  mockEventObject,
  mockBaseTransform,
  mockGetClientDestination,
  mockCardBasic,
  dataRedisEncrypt,
  mockDateInformation,
  mockSmsKeys,
} from '../../../../test/mock-data';
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Logger } from '@dale/logger-nestjs';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/common';
import { SecretsManager } from '../../../shared/secrets-manager/secrets-manager';
import { DynamoDBService } from '../../../providers/dale/services/dynamodb.service';
import { RetiroCBReverseStrategy } from './reverso_retiro_cb.strategy';

//Strategies

describe('ATM reverse strategy', () => {
  let retiroCBReverseStrategy: RetiroCBReverseStrategy;
  let daleNotificationService: DaleNotificationService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetiroCBReverseStrategy,
        CrmService,
        {
          provide: DaleNotificationService,
          useValue: {
            getDateInformation: jest.fn().mockReturnValue(mockDateInformation),
            getSmsKeys: jest.fn().mockReturnValue(mockSmsKeys),
            sendSmsNotification: jest.fn(),
          },
        },
        {
          provide: SecretsManager,
          useFactory: () => ({
            cacheManagerEncrypt: jest.fn().mockReturnValue(dataRedisEncrypt),
            cacheManagerDecrypt: jest.fn().mockReturnValue(mockCardBasic),
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
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(() => of()),
          }),
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
          }),
        },
        {
          provide: DynamoDBService,
          useValue: {
            insertMetadata: jest.fn(),
            findSucceededMetadataByPK: jest.fn(),
          },
        },
      ],
    }).compile();
    retiroCBReverseStrategy = module.get<RetiroCBReverseStrategy>(
      RetiroCBReverseStrategy,
    );
    daleNotificationService = module.get<DaleNotificationService>(
      DaleNotificationService,
    );
    logger = module.get<Logger>(Logger);

    retiroCBReverseStrategy = new RetiroCBReverseStrategy(
      null, // Coloca aquí la instancia del CrmService (puedes utilizar null o una instancia mock si no es relevante para esta prueba)
      daleNotificationService,
      logger,
    );
  });

  it('should be defined', () => {
    expect(retiroCBReverseStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      jest
        .spyOn(retiroCBReverseStrategy, 'sendSmsNotification')
        .mockImplementation(() => Promise.resolve());
      const result = await retiroCBReverseStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });
  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = { productDestination: {} };
      const result = await retiroCBReverseStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = { clientDestination: {} };
      const result = await retiroCBReverseStrategy.getClientDestination(
        id,
        mockEventObject,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getOrderer', () => {
    it('Success', async () => {
      const expected = {
        name: 'Ann',
        secondName: '',
        lastName: 'Doe',
        cellPhone: '3333333333',
        phone: '3333333333',
        externalId: '53',
      };
      const result = retiroCBReverseStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result = retiroCBReverseStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });

  describe('sendSmsNotification', () => {
    it('Success', async () => {
      await expect(
        retiroCBReverseStrategy.sendSmsNotification(mockEventObject),
      ).resolves.toBeUndefined();
    });
  });
});
