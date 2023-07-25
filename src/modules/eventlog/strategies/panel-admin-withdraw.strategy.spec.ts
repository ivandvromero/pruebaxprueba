//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { mockEventObject } from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';
import { PanelAdminWithdrawEventLogStrategy } from './panel-admin-withdraw.strategy';

describe('Panel Admin Event log Strategy monetary adjustments', () => {
  let panelAdminWithdrawEventLogStrategy: PanelAdminWithdrawEventLogStrategy;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelAdminWithdrawEventLogStrategy],
    }).compile();
    panelAdminWithdrawEventLogStrategy =
      module.get<PanelAdminWithdrawEventLogStrategy>(
        PanelAdminWithdrawEventLogStrategy,
      );
  });

  it('should be defined', () => {
    expect(panelAdminWithdrawEventLogStrategy).toBeDefined();
  });
  describe('PanelAdminDepositEventLogStrategy', () => {
    it('PanelAdminDepositEventLogStrategy getCellPhoneOrigin', async () => {
      const result =
        panelAdminWithdrawEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('Intrasolution getCellPhoneDestiny', async () => {
      const result =
        panelAdminWithdrawEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('');
    });
    it('Intrasolution getAdditionalDetail', async () => {
      const result = panelAdminWithdrawEventLogStrategy.getAdditionalDetail(
        mockEventObject,
        [],
      );
      expect(result).toEqual([
        {
          key: 'reason',
          value: undefined,
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
        panelAdminWithdrawEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
    it('should modify baseEventLog and return it', () => {
      // Arrange
      const baseEventLogMock = { audit: { clientId: '', clientIdType: '' } };

      // Act
      const result =
        panelAdminWithdrawEventLogStrategy.doAlgorithm(baseEventLogMock);

      // Assert
      expect(result).toEqual({
        audit: { clientId: '901140552', clientIdType: 'NIT' },
      });
    });
  });
});
