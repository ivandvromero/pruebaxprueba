//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { RetiroCbOtpReverseEventLogStrategy } from './retiro_otp_cb_reverse.strategy';

import {
  mockCashoutCbBaseEvent,
  mockCbWithdrawalAdditionalDetails,
  mockEventObject,
} from '../../../../test/mock-data';

describe('Reverso CB con OTP EventLog Strategy', () => {
  let retiroCbOtpReverseEventLogStrategy: RetiroCbOtpReverseEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetiroCbOtpReverseEventLogStrategy],
    }).compile();
    retiroCbOtpReverseEventLogStrategy =
      module.get<RetiroCbOtpReverseEventLogStrategy>(
        RetiroCbOtpReverseEventLogStrategy,
      );
  });
  it('should be defined', () => {
    expect(retiroCbOtpReverseEventLogStrategy).toBeDefined();
  });
  describe('RetiroCbOtpReverseEventLogStrategy', () => {
    it('Reverso CB con OTP getCellPhoneOrigin', async () => {
      const result = retiroCbOtpReverseEventLogStrategy.getCellPhoneOrigin();
      expect(result).toEqual('');
    });
    it('Reverso CB con OTP getCellPhoneDestiny', async () => {
      const result =
        retiroCbOtpReverseEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });
    it('Reverso CB con OTP getAdditionalDetail', async () => {
      const eventLog = { ...mockEventObject };
      eventLog.CFO.additionals['branchId'] = '0000';
      eventLog.RQ.messageRQ.digitalService = 'RETIRO_CB';
      const result = retiroCbOtpReverseEventLogStrategy.getAdditionalDetail(
        eventLog,
        [],
      );
      const expected = [
        {
          key: 'branchId',
          value: '0000',
        },
        ...mockCbWithdrawalAdditionalDetails,
      ];
      expect(result).toEqual(expected);
    });

    it('Reverso CB con OTP getAdditionalDetail', async () => {
      const event = { ...mockEventObject };
      event.CFO.additionals['branchId'] = null;
      event.RQ.messageRQ.digitalService = 'RETIRO_CB';
      const expected = [
        {
          key: 'branchId',
          value: '',
        },
        ...mockCbWithdrawalAdditionalDetails,
      ];
      const result = retiroCbOtpReverseEventLogStrategy.getAdditionalDetail(
        event,
        [],
      );
      expect(result).toEqual(expected);
    });

    it('Reverso CB con OTP getgetOperators', async () => {
      const result = retiroCbOtpReverseEventLogStrategy.getOperators();
      expect(result).toEqual(['COM0002R', 'IVA1001R', 'GMF1001R']);
    });

    it('should return the same eventObject - non empty date_transaction', () => {
      const expected = { ...mockCashoutCbBaseEvent };
      const result = retiroCbOtpReverseEventLogStrategy.doAlgorithm(
        mockCashoutCbBaseEvent,
      );
      expect(result).toEqual(expected);
    });

    it('should return the same eventObject - non empty date_transaction', () => {
      const cashoutCbBaseEvent = {
        ...mockCashoutCbBaseEvent,
        details: [
          mockCashoutCbBaseEvent.details[0],
          { key: 'date_transaction', value: '' },
        ],
      };
      const result =
        retiroCbOtpReverseEventLogStrategy.doAlgorithm(cashoutCbBaseEvent);
      expect(result).toEqual(mockCashoutCbBaseEvent);
    });
  });
});
