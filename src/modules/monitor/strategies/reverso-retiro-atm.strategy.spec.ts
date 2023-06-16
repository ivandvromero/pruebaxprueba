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
} from '../../../../test/mock-data';
import { RetiroAtmOtpReverseCashStrategy } from './reverso-retiro-atm.strategy';
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Logger } from '@dale/logger-nestjs';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/common';
import { SecretsManager } from '../../../shared/secrets-manager/secrets-manager';
import { DynamoDBService } from '../../../providers/dale/services/dynamodb.service';

//Strategies

describe('ATM reverse strategy', () => {
  let retiroAtmOtpReverseCashStrategy: RetiroAtmOtpReverseCashStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetiroAtmOtpReverseCashStrategy,
        CrmService,
        DaleNotificationService,
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
    retiroAtmOtpReverseCashStrategy =
      module.get<RetiroAtmOtpReverseCashStrategy>(
        RetiroAtmOtpReverseCashStrategy,
      );
  });

  it('should be defined', () => {
    expect(retiroAtmOtpReverseCashStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      jest
        .spyOn(retiroAtmOtpReverseCashStrategy, 'sendSmsNotification')
        .mockImplementation(() => Promise.resolve());
      const result = await retiroAtmOtpReverseCashStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });
  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = { productDestination: {} };
      const result =
        await retiroAtmOtpReverseCashStrategy.getProductDestination(
          mockEventObject,
          mockGetClientDestination,
        );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = { clientDestination: {} };
      const result = await retiroAtmOtpReverseCashStrategy.getClientDestination(
        id,
        mockEventObject,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getOrderer', () => {
    it('Success', async () => {
      const expected = {
        cellPhone: '3333333333',
        externalId: '53',
        lastName: 'Doe',
        name: 'Ann',
        phone: '3333333333',
        secondName: '',
      };
      const result =
        retiroAtmOtpReverseCashStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result =
        retiroAtmOtpReverseCashStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
});
