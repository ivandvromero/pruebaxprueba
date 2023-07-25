//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { Cell2CellCashOutEventLogStrategy } from './c2c-cashout.strategy';

import { mockEventObject } from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Cell2Cell Enviar EventLog Strategy', () => {
  let cell2CellCashOutEventLogStrategy: Cell2CellCashOutEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cell2CellCashOutEventLogStrategy],
    }).compile();
    cell2CellCashOutEventLogStrategy =
      module.get<Cell2CellCashOutEventLogStrategy>(
        Cell2CellCashOutEventLogStrategy,
      );
  });

  it('should be defined', () => {
    expect(cell2CellCashOutEventLogStrategy).toBeDefined();
  });
  describe('Cell2CellCashOutEventLogStrategy', () => {
    it('getCellPhoneOrigin', async () => {
      const result =
        cell2CellCashOutEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('getCellPhoneDestiny', async () => {
      const result =
        cell2CellCashOutEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('');
    });
    it('getAdditionalDetail', async () => {
      const idetailMock = [{ key: 'destiny_account', value: '' }];
      const expected = [
        { key: 'destiny_account', value: '0000000023' },

        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
      ];
      const result = cell2CellCashOutEventLogStrategy.getAdditionalDetail(
        mockEventObject,
        idetailMock,
      );
      expect(result).toEqual(expected);
    });

    it('getgetOperators', async () => {
      const result =
      cell2CellCashOutEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
    it('should return the same eventObject', () => {
      const result =
        cell2CellCashOutEventLogStrategy.doAlgorithm(mockEventObject);
      expect(result).toBe(mockEventObject);
    });
  });
});
