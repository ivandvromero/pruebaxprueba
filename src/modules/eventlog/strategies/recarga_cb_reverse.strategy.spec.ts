//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { RecargaCbReverseEventLogStrategy } from './recarga_cb_reverse.strategy';

import { mockCashoutCbBaseEvent, mockEventObject } from '../../../../test/mock-data';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Reverso CB EventLog Strategy', () => {
  let recargaCbReverseEventLogStrategy: RecargaCbReverseEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecargaCbReverseEventLogStrategy],
    }).compile();
    recargaCbReverseEventLogStrategy = module.get<RecargaCbReverseEventLogStrategy>(
      RecargaCbReverseEventLogStrategy,
    );
  });
  it('should be defined', () => {
    expect(recargaCbReverseEventLogStrategy).toBeDefined();
  });
  describe('recargaCbReverseEventLogStrategy', () => {
    it('Reverso CB getCellPhoneOrigin', async () => {
      const result =
        recargaCbReverseEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('Reverso CB getCellPhoneDestiny', async () => {
      const result =
        recargaCbReverseEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('');
    });
    it('Reverso CB getAdditionalDetail', async () => {
      const event = {...mockEventObject};
      const result = recargaCbReverseEventLogStrategy.getAdditionalDetail(
        event,
        [],
      );
      expect(result).toEqual([
        {
          key: 'type_load',
          value: 'cash',
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

    it('Reverso CB getgetOperators', async () => {
      const result =
      recargaCbReverseEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });

    it('doAlgorithm - non empty date_transaction', () => {
      const expected = { ...mockCashoutCbBaseEvent };
      const result = recargaCbReverseEventLogStrategy.doAlgorithm(
        mockCashoutCbBaseEvent,
      );
      expect(result).toEqual(expected);
    });

    it('doAlgorithm - non empty date_transaction', () => {
      const cashoutCbBaseEvent = {
        ...mockCashoutCbBaseEvent,
        details: [
          mockCashoutCbBaseEvent.details[0],
          { key: 'date_transaction', value: '' },
        ],
      };
      const result =
      recargaCbReverseEventLogStrategy.doAlgorithm(cashoutCbBaseEvent);
      expect(result).toEqual(mockCashoutCbBaseEvent);
    });
  });
});
