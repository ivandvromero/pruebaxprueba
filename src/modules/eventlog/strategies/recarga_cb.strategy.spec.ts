//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { RecargaCbEventLogStrategy } from './recarga_cb.strategy';

import { mockCashoutCbBaseEvent, mockEventObject } from '../../../../test/mock-data';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Recarga CB EventLog Strategy', () => {
  let recargaCbEventLogStrategy: RecargaCbEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecargaCbEventLogStrategy],
    }).compile();
    recargaCbEventLogStrategy = module.get<RecargaCbEventLogStrategy>(
      RecargaCbEventLogStrategy,
    );
  });
  it('should be defined', () => {
    expect(recargaCbEventLogStrategy).toBeDefined();
  });
  describe('RecargaCbEventLogStrategy', () => {
    it('Recarga CB getCellPhoneOrigin', async () => {
      const result =
        recargaCbEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('');
    });
    it('Recarga CB getCellPhoneDestiny', async () => {
      const result =
        recargaCbEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });
    it('Recarga CB getAdditionalDetail', async () => {
      const event = {...mockEventObject};
      event.CFO.additionals['branchId'] = 'branchId';
      const result = recargaCbEventLogStrategy.getAdditionalDetail(
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

    it('Recarga CB getgetOperators', async () => {
      const result =
      recargaCbEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });

    it('doAlgorithm - non empty date_transaction', () => {
      const expected = { ...mockCashoutCbBaseEvent };
      const result = recargaCbEventLogStrategy.doAlgorithm(
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
      recargaCbEventLogStrategy.doAlgorithm(cashoutCbBaseEvent);
      expect(result).toEqual(mockCashoutCbBaseEvent);
    });
  });
});
