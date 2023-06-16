//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { IntrasolutionD2D1AndReverseEventLogStrategy } from './instrasolution-d2d1-and-reverse.strategy';
import {
  mockEventObject,
  mockEventObjectReverseOrdinal,
} from '../../../../test/mock-data';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('instrasolucion D2D1 Enviar EventLog Strategy', () => {
  let intrasolutionD2D1AndReverseEventLogStrategy: IntrasolutionD2D1AndReverseEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntrasolutionD2D1AndReverseEventLogStrategy],
    }).compile();
    intrasolutionD2D1AndReverseEventLogStrategy =
      module.get<IntrasolutionD2D1AndReverseEventLogStrategy>(
        IntrasolutionD2D1AndReverseEventLogStrategy,
      );
  });

  it('should be defined', () => {
    expect(intrasolutionD2D1AndReverseEventLogStrategy).toBeDefined();
  });
  describe('intrasolutionD2D1EventLogStrategy', () => {
    it('getCellPhoneOrigin', async () => {
      const result =
        intrasolutionD2D1AndReverseEventLogStrategy.getCellPhoneOrigin(
          mockEventObject,
        );
      expect(result).toEqual('3186779266');
    });
    it('getCellPhoneDestiny', async () => {
      const result =
        intrasolutionD2D1AndReverseEventLogStrategy.getCellPhoneDestiny(
          mockEventObject,
        );
      expect(result).toEqual('3186779266');
    });
    it('Intrasolution getAdditionalDetail success(debit)', async () => {
      const idetailMock = [{ key: 'destiny_account', value: '' }];
      const expected = [
        { key: 'destiny_account', value: '0000008' },
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
        { key: 'destiny_account_type', value: 'BANCO1' },
      ];
      const result =
        intrasolutionD2D1AndReverseEventLogStrategy.getAdditionalDetail(
          mockEventObject,
          idetailMock,
          'debit',
        );
      expect(result).toEqual(expected);
    });

    it('Intrasolution getAdditionalDetail fail(reverse)', async () => {
      const idetailMock = [{ key: 'destiny_account', value: '' }];
      const expected = [
        {
          key: 'destiny_account',
          value: '2000000',
        },
        {
          key: 'type',
          value: 'intrasolucion',
        },
        {
          key: 'destiny_account_type',
          value: 'DALE',
        },
      ];
      mockEventObject.RS.messageRS.responses[0].confirmations.push(
        mockEventObjectReverseOrdinal,
      );
      const result =
        intrasolutionD2D1AndReverseEventLogStrategy.getAdditionalDetail(
          mockEventObject,
          idetailMock,
          'credit',
        );
      expect(result).toEqual(expected);
    });

    it('getOperators debits', async () => {
      const result = intrasolutionD2D1AndReverseEventLogStrategy.getOperators(
        mockEventObject,
        'debit',
      );
      expect(result).toBeDefined();
    });
    it('getOperators credits', async () => {
      mockEventObject.RS.messageRS.responses[0].confirmations.push(
        mockEventObjectReverseOrdinal,
      );
      const result = intrasolutionD2D1AndReverseEventLogStrategy.getOperators(
        mockEventObject,
        'credit',
      );
      expect(result).toBeDefined();
    });
  });
});
