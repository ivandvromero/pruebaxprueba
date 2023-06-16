//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { TransifyaRecibirEventLogStrategy } from './transfiya-recibir.strategy';
import { mockAdditionals, mockEventObject } from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Transifya Recibir EventLog Strategy', () => {
  let transifyaRecibirStrategy: TransifyaRecibirEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransifyaRecibirEventLogStrategy],
    }).compile();
    transifyaRecibirStrategy = module.get<TransifyaRecibirEventLogStrategy>(
      TransifyaRecibirEventLogStrategy,
    );
  });

  it('should be defined', () => {
    expect(transifyaRecibirStrategy).toBeDefined();
  });
  describe('TransifyaEnviarEventLogStrategy', () => {
    it('Transifya getCellPhoneOrigin', async () => {
      let event = {...mockEventObject};
      event.CFO['additionals'] = mockAdditionals;
      const result =
        transifyaRecibirStrategy.getCellPhoneOrigin(event);
      expect(result).toEqual('3999999999');
    });

    it('Transifya getCellPhoneDestiny', async () => {
      const result =
        transifyaRecibirStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });

    it('Transifya getAdditionalDetail', async () => {
      const result = transifyaRecibirStrategy.getAdditionalDetail(
        mockEventObject,
        [],
      );
      expect(result).toEqual([
        {
          key: 'cus',
          value: 'TESTCUS',
        },
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
        {
          key: 'message_transaction',
          value: 'message',
        },
      ]);
    });

    it('Transifya getgetOperators', async () => {
      const result =
        transifyaRecibirStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
  });
});
