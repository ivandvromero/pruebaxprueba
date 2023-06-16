//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { Cell2CellCashOutReverseEventLogStrategy } from './c2c-cashout-reverse.strategy';

import { mockEventObject } from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Cell2Cell Enviar Reverso EventLog Strategy', () => {
  let cell2CellCashOutReverseEventLogStrategy: Cell2CellCashOutReverseEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cell2CellCashOutReverseEventLogStrategy],
    }).compile();
    cell2CellCashOutReverseEventLogStrategy =
      module.get<Cell2CellCashOutReverseEventLogStrategy>(
        Cell2CellCashOutReverseEventLogStrategy,
      );
  });

  it('should be defined', () => {
    expect(cell2CellCashOutReverseEventLogStrategy).toBeDefined();
  });
  describe('c2cEnviarEventLogStrategy', () => {
    it('c2c getCellPhoneOrigin', async () => {
      const result =
        cell2CellCashOutReverseEventLogStrategy.getCellPhoneOrigin(
          mockEventObject,
        );
      expect(result).toEqual('');
    });
    it('c2c getCellPhoneDestiny', async () => {
      const result =
        cell2CellCashOutReverseEventLogStrategy.getCellPhoneDestiny(
          mockEventObject,
        );
      expect(result).toEqual('3333333333');
    });
    it('c2c getAdditionalDetail', async () => {
      const result =
        cell2CellCashOutReverseEventLogStrategy.getAdditionalDetail(
          mockEventObject,
          [],
        );
      expect(result).toEqual([
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
      ]);
    });
    it('c2c getgetOperators', async () => {
      const result =
      cell2CellCashOutReverseEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
  });
});
