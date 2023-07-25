//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { PsePaymentEventLogStrategy } from './pse-payment.strategy';

import {
  mockCashoutCbBaseEvent,
  mockEventObject,
} from '../../../../test/mock-data';

describe('PSE Payment EventLog Strategy', () => {
  let psePaymentEventLogStrategy: PsePaymentEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PsePaymentEventLogStrategy],
    }).compile();
    psePaymentEventLogStrategy = module.get<PsePaymentEventLogStrategy>(
      PsePaymentEventLogStrategy,
    );
  });

  it('should be defined', () => {
    expect(psePaymentEventLogStrategy).toBeDefined();
  });
  describe('PsePaymentEventLogStrategy', () => {
    it('Pagos PSE getCellPhoneOrigin', async () => {
      const result =
        psePaymentEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('Pagos PSE getCellPhoneDestiny', async () => {
      const result = psePaymentEventLogStrategy.getCellPhoneDestiny();
      expect(result).toEqual('');
    });

    it('Pagos PSE getAdditionalDetail', async () => {
      const event = { ...mockEventObject };
      const expected = [
        {
          key: 'type',
          value: 'pse_pagos',
        },
      ];
      event.RQ.messageRQ.digitalService = 'Pagos_PSE';
      const result = psePaymentEventLogStrategy.getAdditionalDetail(event, []);
      expect(result).toEqual(expected);
    });

    it('Pagos PSE getOperators', async () => {
      const result = psePaymentEventLogStrategy.getOperators();
      expect(result).toEqual(['COM0005', 'IVA1001', 'GMF1001']);
    });

    it('should return the same eventObject - non empty date_transaction', () => {
      const expected = { ...mockCashoutCbBaseEvent };
      const result = psePaymentEventLogStrategy.doAlgorithm(
        mockCashoutCbBaseEvent,
      );
      expect(result).toEqual(expected);
    });

    it('should return the same eventObject - empty date_transaction', () => {
      const cashoutCbBaseEvent = {
        ...mockCashoutCbBaseEvent,
        details: [
          mockCashoutCbBaseEvent.details[0],
          { key: 'date_transaction', value: '' },
        ],
      };
      const result = psePaymentEventLogStrategy.doAlgorithm(cashoutCbBaseEvent);
      expect(result).toEqual(mockCashoutCbBaseEvent);
    });
  });
});
