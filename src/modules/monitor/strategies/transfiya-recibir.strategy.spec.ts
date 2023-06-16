//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Mock Data
import {
  id,
  mockEventObject,
  mockBaseTransform,
  mockGetClientDestination,
} from '../../../../test/mock-data';

//Strategies
import { TransifyaRecibirStrategy } from './transfiya-recibir.strategy';

describe('Transifya Recibir Strategy', () => {
  let transifyaRecibirStrategy: TransifyaRecibirStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransifyaRecibirStrategy],
    }).compile();
    transifyaRecibirStrategy = module.get<TransifyaRecibirStrategy>(
      TransifyaRecibirStrategy,
    );
  });

  it('should be defined', () => {
    expect(transifyaRecibirStrategy).toBeDefined();
  });
  describe('doAlgorithm', () => {
    it('Success', async () => {
      jest
        .spyOn(transifyaRecibirStrategy, 'sendSmsNotification')
        .mockImplementation(() => Promise.resolve());
      const result = await transifyaRecibirStrategy.doAlgorithm(
        mockBaseTransform,
        mockEventObject,
      );
      expect(result).toEqual(mockBaseTransform);
    });
  });
  describe('getProductDestination', () => {
    it('Success', async () => {
      const expected = { productDestination: {} };
      const result = await transifyaRecibirStrategy.getProductDestination(
        mockEventObject,
        mockGetClientDestination,
      );
      expect(result).toEqual(expected);
    });
  });
  describe('getClientDestination', () => {
    it('Success', async () => {
      const expected = { clientDestination: {} };
      const result = await transifyaRecibirStrategy.getClientDestination(
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
      const result = transifyaRecibirStrategy.getOrderer(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
  describe('getBeneficiary', () => {
    it('Success', async () => {
      const expected = {
        externalId: '',
      };
      const result = transifyaRecibirStrategy.getBeneficiary(mockEventObject);
      expect(result).toEqual(expected);
    });
  });
});
