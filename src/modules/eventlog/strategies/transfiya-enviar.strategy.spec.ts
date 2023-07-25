//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { TransifyaEnviarEventLogStrategy } from './transfiya-enviar.strategy';

import { mockAdditionals, mockEventObject } from '../../../../test/mock-data';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Transifya Enviar EventLog Strategy', () => {
  let transifyaEnviarStrategy: TransifyaEnviarEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransifyaEnviarEventLogStrategy],
    }).compile();
    transifyaEnviarStrategy = module.get<TransifyaEnviarEventLogStrategy>(
      TransifyaEnviarEventLogStrategy,
    );
  });

  it('should be defined', () => {
    expect(transifyaEnviarStrategy).toBeDefined();
  });
  describe('TransifyaEnviarEventLogStrategy', () => {
    it('Transifya getCellPhoneOrigin', async () => {
      const result =
        transifyaEnviarStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('Transifya getCellPhoneDestiny', async () => {
      const event = { ...mockEventObject };
      event.CFO['additionals'] = mockAdditionals;
      const result = transifyaEnviarStrategy.getCellPhoneDestiny(event);
      expect(result).toEqual('3001233303');
    });

    it('Transifya getAdditionalDetail', async () => {
      const eventLog = { ...mockEventObject };
      eventLog.RQ.messageRQ.additionals['userCustomMessage'] = 'message';
      const result = transifyaEnviarStrategy.getAdditionalDetail(eventLog, []);
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
      const result = transifyaEnviarStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
    it('should return the same eventObject', () => {
      const result = transifyaEnviarStrategy.doAlgorithm(mockEventObject);

      expect(result).toBe(mockEventObject);
    });
  });
});
