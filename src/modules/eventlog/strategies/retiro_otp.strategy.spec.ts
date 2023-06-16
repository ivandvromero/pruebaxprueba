//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { RetiroAtmOtpEventLogStrategy } from './retiro_otp.strategy';

import { mockEventObject } from '../../../../test/mock-data';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Retiro Atm Otp EventLog Strategy', () => {
  let retiroAtmOtpEventLogStrategy: RetiroAtmOtpEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetiroAtmOtpEventLogStrategy],
    }).compile();
    retiroAtmOtpEventLogStrategy = module.get<RetiroAtmOtpEventLogStrategy>(
      RetiroAtmOtpEventLogStrategy,
    );
  });
  it('should be defined', () => {
    expect(retiroAtmOtpEventLogStrategy).toBeDefined();
  });
  describe('RetiroAtmOtpEventLogStrategy', () => {
    it('Retiro Intrasolution getCellPhoneOrigin', async () => {
      const result =
        retiroAtmOtpEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('Retiro Intrasolution getCellPhoneDestiny', async () => {
      const result =
        retiroAtmOtpEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('');
    });
    it('Retiro Intrasolution getAdditionalDetail', async () => {
      const event = {...mockEventObject};
      event.CFO.additionals['branchId'] = 'branchId';
      const result = retiroAtmOtpEventLogStrategy.getAdditionalDetail(
        event,
        [],
      );
      expect(result).toEqual([
        {
          key: 'branchId',
          value: 'branchId',
        },
        {
          key: 'branch_type',
          value: 'ATM',
        },
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
      ]);
    });

    it('Retiro otp getgetOperators', async () => {
      const result =
      retiroAtmOtpEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
  });
});
