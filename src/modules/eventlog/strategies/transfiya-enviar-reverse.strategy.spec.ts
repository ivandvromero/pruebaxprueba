//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { TransifyaEnviarReverseEventLogStrategy } from './transfiya-enviar-reverse.strategy';

import { mockEventObject } from '../../../../test/mock-data';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Transifya Enviar Revese EventLog Strategy', () => {
  let transifyaEnviarReverseEventLogStrategy: TransifyaEnviarReverseEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransifyaEnviarReverseEventLogStrategy],
    }).compile();
    transifyaEnviarReverseEventLogStrategy =
      module.get<TransifyaEnviarReverseEventLogStrategy>(
        TransifyaEnviarReverseEventLogStrategy,
      );
  });

  it('should be defined', () => {
    expect(transifyaEnviarReverseEventLogStrategy).toBeDefined();
  });
  describe('TransifyaEnviarEventLogStrategy', () => {
    it('Transifya getCellPhoneOrigin', async () => {
      const result =
        transifyaEnviarReverseEventLogStrategy.getCellPhoneOrigin(
          mockEventObject,
        );
      expect(result).toEqual('');
    });
    it('Transifya getCellPhoneDestiny', async () => {
      const result =
        transifyaEnviarReverseEventLogStrategy.getCellPhoneDestiny(
          mockEventObject,
        );
      expect(result).toEqual('3333333333');
    });
    it('Transifya getAdditionalDetail', async () => {
      let event = {...mockEventObject};
      event.CFO.beneficiaries[0].additionals['userCustomMessage'] = "message'''";
      const result = transifyaEnviarReverseEventLogStrategy.getAdditionalDetail(
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
        }
      ]);
    });

    it('Transifya getgetOperators', async () => {
      const result =
      transifyaEnviarReverseEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
  });
});
