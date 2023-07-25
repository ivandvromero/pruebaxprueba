//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { IntrasolutionAndReverseEventLogStrategy } from './intrasolution-and-reverse.strategy';
import {
  mockEventObject,
  mockEventReverseIntraD2D2Object,
} from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Intrasolution and Reverse Event log Strategy', () => {
  let intrasolutionStrategy: IntrasolutionAndReverseEventLogStrategy;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntrasolutionAndReverseEventLogStrategy],
    }).compile();
    intrasolutionStrategy = module.get<IntrasolutionAndReverseEventLogStrategy>(
      IntrasolutionAndReverseEventLogStrategy,
    );
  });

  it('should be defined', () => {
    expect(intrasolutionStrategy).toBeDefined();
  });
  describe('IntrasolutionAndReverseEventLogStrategy', () => {
    it('getCellPhoneOrigin', async () => {
      const result = intrasolutionStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('getCellPhoneDestiny', async () => {
      const result = intrasolutionStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });
    it('getAdditionalDetail success(credit) and no reverse event', async () => {
      const type = 'credit';
      const expected = [
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
      ];
      const result = intrasolutionStrategy.getAdditionalDetail(
        mockEventObject,
        [],
        type,
      );
      expect(result).toEqual(expected);
    });
    it('getAdditionalDetail success(debit) and no reverse event', async () => {
      const type = 'debit';
      const expected = [
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
      ];
      const result = intrasolutionStrategy.getAdditionalDetail(
        mockEventObject,
        [],
        type,
      );
      expect(result).toEqual(expected);
    });
    it('getAdditionalDetail success(credit) and reverse event', async () => {
      const idetailMock = [
        { key: 'destiny_account', value: '' },
        { key: 'destiny_cellphone', value: '' },
        { key: 'mesage', value: '' },
        { key: 'status', value: '' },
        { key: 'code', value: '' },
      ];
      const type = 'credit';
      const expected = [
        {
          key: 'destiny_account',
          value: '2000000',
        },
        {
          key: 'destiny_cellphone',
          value: '3186779266',
        },
        {
          key: 'mesage',
          value: 'TRANSACCION EXITOSA',
        },
        {
          key: 'status',
          value: 'aprobada',
        },
        {
          key: 'code',
          value: '0',
        },
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
      ];
      const result = intrasolutionStrategy.getAdditionalDetail(
        mockEventReverseIntraD2D2Object,
        idetailMock,
        type,
      );
      expect(result).toEqual(expected);
    });
    it('getAdditionalDetail success(debit) and reverse event', async () => {
      const idetailMock = [{ key: 'destiny_account', value: '' }];
      const type = 'debit';
      const expected = [
        {
          key: 'destiny_account',
          value: '2000000',
        },
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
      ];
      const result = intrasolutionStrategy.getAdditionalDetail(
        mockEventReverseIntraD2D2Object,
        idetailMock,
        type,
      );
      expect(result).toEqual(expected);
    });

    it('getgetOperators debit and no reverse event', async () => {
      const type = 'debit';
      const expected = ['COM0005', 'IVA1001', 'GMF1001'];
      const result = intrasolutionStrategy.getOperators(mockEventObject, type);
      expect(result).toEqual(expected);
    });
    it('getgetOperators credit and no reverse event', async () => {
      const type = 'credit';
      const expected = ['COM0005', 'IVA1001', 'GMF1001'];
      const result = intrasolutionStrategy.getOperators(mockEventObject, type);
      expect(result).toEqual(expected);
    });

    it('getgetOperators credit and reverse event', async () => {
      const type = 'credit';
      const expected = ['COM0005R', 'IVA1001R', 'GMF1001R'];
      const result = intrasolutionStrategy.getOperators(
        mockEventReverseIntraD2D2Object,
        type,
      );
      expect(result).toEqual(expected);
    });
    it('getgetOperators debit and reverse event', async () => {
      const type = 'debit';
      const expected = ['COM0005', 'IVA1001', 'GMF1001'];
      const result = intrasolutionStrategy.getOperators(
        mockEventReverseIntraD2D2Object,
        type,
      );
      expect(result).toEqual(expected);
    });
    it('should return the same eventObject', () => {
      const result = intrasolutionStrategy.doAlgorithm(mockEventObject);
      expect(result).toBe(mockEventObject);
    });
  });
});
