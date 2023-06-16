//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { Cell2CellCashInEventLogStrategy } from './c2c-cashin.strategy';

import { mockEventObject } from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Cell2Cell Recibir EventLog Strategy', () => {
  let cell2CellCashInEventLogStrategy: Cell2CellCashInEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cell2CellCashInEventLogStrategy],
    }).compile();
    cell2CellCashInEventLogStrategy =
      module.get<Cell2CellCashInEventLogStrategy>(
        Cell2CellCashInEventLogStrategy,
      );
  });

  it('should be defined', () => {
    expect(cell2CellCashInEventLogStrategy).toBeDefined();
  });
  describe('Cell2CellCashInEventLogStrategy', () => {
    it('getCellPhoneOrigin', async () => {
      const result =
        cell2CellCashInEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('');
    });
    it('getCellPhoneDestiny', async () => {
      const result =
        cell2CellCashInEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });
    it('getAdditionalDetail', async () => {
      const idetailMock = [{ key: 'origin_account', value: '' }];
      const expected = [
        { key: 'origin_account', value: '0000011' },
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
        {
          key: 'bank_origin',
          value: '0001',
        },
        {
          key: 'account_type',
          value: '01',
        },
      ];
      const result = cell2CellCashInEventLogStrategy.getAdditionalDetail(
        mockEventObject,
        idetailMock,
      );
      expect(result).toEqual(expected);
    });
    it('c2c getgetOperators', async () => {
      const result =
      cell2CellCashInEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
  });
});
