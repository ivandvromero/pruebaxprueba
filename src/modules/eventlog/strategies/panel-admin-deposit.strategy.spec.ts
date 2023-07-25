//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { PanelAdminDepositEventLogStrategy } from './panel-admin-deposit.strategy';
import { mockEventObject } from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Panel Admin Event log Strategy monetary adjustments', () => {
  let panelAdminDepositEventLogStrategy: PanelAdminDepositEventLogStrategy;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelAdminDepositEventLogStrategy],
    }).compile();
    panelAdminDepositEventLogStrategy =
      module.get<PanelAdminDepositEventLogStrategy>(
        PanelAdminDepositEventLogStrategy,
      );
  });

  it('should be defined', () => {
    expect(panelAdminDepositEventLogStrategy).toBeDefined();
  });
  describe('PanelAdminDepositEventLogStrategy', () => {
    it('PanelAdminDepositEventLogStrategy getCellPhoneOrigin', async () => {
      const result =
        panelAdminDepositEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('');
    });
    it('Intrasolution getCellPhoneDestiny', async () => {
      const result =
        panelAdminDepositEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });
    it('Intrasolution getAdditionalDetail', async () => {
      const result = panelAdminDepositEventLogStrategy.getAdditionalDetail(
        mockEventObject,
        [],
      );
      expect(result).toEqual([
        {
          key: 'reason',
          value: '',
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

    it('PanelAdmin getgetOperators', async () => {
      const result =
        panelAdminDepositEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
  });
  it('should return the same eventObject', () => {
    const result =
      panelAdminDepositEventLogStrategy.doAlgorithm(mockEventObject);

    expect(result).toBe(mockEventObject);
  });
});
