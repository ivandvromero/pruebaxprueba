//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  mockEventObject,
  mockBaseTransform,
  mockGetClientDestination,
  mockEmptyClientdestination,
  mockDateInformation,
  mockSmsKeys,
} from '../../../../test/mock-data';

//Strategies
import { GeneracionOtpRetiroAtmStrategy } from './generacion_otp_retiro_atm.strategy';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Logger } from '@dale/logger-nestjs';
import { DynamoDBService } from '../../../providers/dale/services/dynamodb.service';
import { of } from 'rxjs';

describe('GeneracionOtpRetiroAtmStrategy', () => {
  let generacionOtpRetiroAtmStrategy: GeneracionOtpRetiroAtmStrategy;
  let daleNotificationService: DaleNotificationService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneracionOtpRetiroAtmStrategy,
        {
          provide: DaleNotificationService,
          useValue: {
            getDateInformation: jest.fn().mockReturnValue(mockDateInformation),
            getSmsKeys: jest.fn().mockReturnValue(mockSmsKeys),
            sendSmsNotification: jest.fn(),
          },
        },
        {
          provide: DynamoDBService,
          useValue: {
            insertMetadata: jest.fn(),
            findSucceededMetadataByPK: jest.fn(),
          },
        },
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
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
    generacionOtpRetiroAtmStrategy = module.get<GeneracionOtpRetiroAtmStrategy>(
      GeneracionOtpRetiroAtmStrategy,
    );
    daleNotificationService = module.get<DaleNotificationService>(
      DaleNotificationService,
    );
    logger = module.get<Logger>(Logger);
    generacionOtpRetiroAtmStrategy = new GeneracionOtpRetiroAtmStrategy(
      null, // Coloca aquí la instancia del CrmService (puedes utilizar null o una instancia mock si no es relevante para esta prueba)
      daleNotificationService,
      logger,
    );
  });

  it('should be defined', () => {
    expect(generacionOtpRetiroAtmStrategy).toBeDefined();
  });

  describe('doAlgorithm', () => {
    it('Success', async () => {
      jest
        .spyOn(generacionOtpRetiroAtmStrategy, 'sendSmsNotification')
        .mockImplementation(() => Promise.resolve());
      const result = await generacionOtpRetiroAtmStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });

  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = {
        productDestination: {
          Field_K7_0072: 'DE2',
          Field_K7_0073: '',
          Field_K7_0074: '',
          Field_K7_0075: '',
          Field_K7_0076: '',
          Field_K7_0077: 0,
          Field_K7_0078: 0,
          Field_K7_0079: '',
          Field_K7_0080: '',
          Field_K7_0081: 0,
          Field_K7_0082: 'CO',
          Field_K7_0083: 0,
        },
      };
      const result = await generacionOtpRetiroAtmStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('getClientDestination', () => {
    it('Success', async () => {
      const result = await generacionOtpRetiroAtmStrategy.getClientDestination(
        id,
        mockEventObject,
      );
      expect(result).toEqual({ clientDestination: mockEmptyClientdestination });
    });
  });

  describe('getOrderer', () => {
    it('Success', async () => {
      const expected = {
        cellPhone: '318-677-9266',
        externalId: '52',
        lastName: 'Doe',
        name: 'Jhoon',
        phone: '318-677-9266',
        secondName: '',
      };
      const result = generacionOtpRetiroAtmStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });

  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '0',
      };
      const result =
        generacionOtpRetiroAtmStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });

  describe('sendSmsNotification', () => {
    it('Success', async () => {
      await expect(
        generacionOtpRetiroAtmStrategy.sendSmsNotification(mockEventObject),
      ).resolves.toBeUndefined();
    });
  });
});
