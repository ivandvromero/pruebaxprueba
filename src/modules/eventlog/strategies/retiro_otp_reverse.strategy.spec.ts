//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { RetiroAtmOtpReveseEventLogStrategy } from './retiro_otp_reverse.strategy';

import { mockEventObject } from '../../../../test/mock-data';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Retiro Atm Otp EventLog Strategy', () => {
  let retiroAtmOtpReveseEventLogStrategy: RetiroAtmOtpReveseEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetiroAtmOtpReveseEventLogStrategy],
    }).compile();
    retiroAtmOtpReveseEventLogStrategy =
      module.get<RetiroAtmOtpReveseEventLogStrategy>(
        RetiroAtmOtpReveseEventLogStrategy,
      );
  });
  it('should be defined', () => {
    expect(retiroAtmOtpReveseEventLogStrategy).toBeDefined();
  });
  describe('RetiroAtmOtpEventLogStrategy', () => {
    it('Retiro Intrasolution getCellPhoneOrigin', async () => {
      const result =
        retiroAtmOtpReveseEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('');
    });
    it('Retiro Intrasolution getCellPhoneDestiny', async () => {
      const result =
        retiroAtmOtpReveseEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });
    it('Retiro Intrasolution getAdditionalDetail', async () => {
      const event = {...mockEventObject};
      event.CFO.additionals['branchId'] = 'branchId';
      const result = retiroAtmOtpReveseEventLogStrategy.getAdditionalDetail(
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

    it('Retiro Intrasolution getgetOperators', async () => {
      const result =
      retiroAtmOtpReveseEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
  });
});
