//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { RetiroCbOtpEventLogStrategy } from './retiro_otp_cb.strategy';

import {
  mockCashoutCbBaseEvent,
  mockCbWithdrawalAdditionalDetails,
  mockEventObject,
} from '../../../../test/mock-data';

describe('Retiro CB con OTP EventLog Strategy', () => {
  let retiroCbOtpEventLogStrategy: RetiroCbOtpEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetiroCbOtpEventLogStrategy],
    }).compile();
    retiroCbOtpEventLogStrategy = module.get<RetiroCbOtpEventLogStrategy>(
      RetiroCbOtpEventLogStrategy,
    );
  });

  it('should be defined', () => {
    expect(retiroCbOtpEventLogStrategy).toBeDefined();
  });
  describe('RetiroCbOtpEventLogStrategy', () => {
    it('Retiro CB con OTP getCellPhoneOrigin', async () => {
      const result =
        retiroCbOtpEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('Retiro CB con OTP getCellPhoneDestiny', async () => {
      const result = retiroCbOtpEventLogStrategy.getCellPhoneDestiny();
      expect(result).toEqual('');
    });

    it('Retiro CB con OTP getAdditionalDetail', async () => {
      const eventLog = { ...mockEventObject };
      eventLog.CFO.additionals['branchId'] = '0000';
      eventLog.RQ.messageRQ.digitalService = 'RETIRO_CB';
      const result = retiroCbOtpEventLogStrategy.getAdditionalDetail(
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

    it('Retiro CB con OTP getAdditionalDetail', async () => {
      const event = { ...mockEventObject };
      event.CFO.additionals['branchId'] = null;
      const expected = [
        {
          key: 'branchId',
          value: '',
        },
        ...mockCbWithdrawalAdditionalDetails,
      ];
      event.RQ.messageRQ.digitalService = 'RETIRO_CB';
      const result = retiroCbOtpEventLogStrategy.getAdditionalDetail(event, []);
      expect(result).toEqual(expected);
    });

    it('Retiro CB con OTP getgetOperators', async () => {
      const result = retiroCbOtpEventLogStrategy.getOperators();
      expect(result).toEqual(['COM0002', 'IVA1001', 'GMF1001']);
    });

    it('should return the same eventObject - non empty date_transaction', () => {
      const expected = { ...mockCashoutCbBaseEvent };
      const result = retiroCbOtpEventLogStrategy.doAlgorithm(
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
        retiroCbOtpEventLogStrategy.doAlgorithm(cashoutCbBaseEvent);
      expect(result).toEqual(mockCashoutCbBaseEvent);
    });
  });
});
