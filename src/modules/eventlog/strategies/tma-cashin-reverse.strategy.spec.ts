//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { TMACashInReverseEventLogStrategy } from './tma-cashin-reverse.strategy';

import { mockEventObject } from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('TMA Reverso EventLog Strategy', () => {
  let tmaCashInReverseEventLogStrategy: TMACashInReverseEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TMACashInReverseEventLogStrategy],
    }).compile();
    tmaCashInReverseEventLogStrategy =
      module.get<TMACashInReverseEventLogStrategy>(
        TMACashInReverseEventLogStrategy,
      );
  });
  it('should be defined', () => {
    expect(tmaCashInReverseEventLogStrategy).toBeDefined();
  });
  describe('tmaEnviarEventLogStrategy', () => {
    it('tma getCellPhoneOrigin', async () => {
      const result =
        tmaCashInReverseEventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('TMA getCellPhoneDestiny', async () => {
      const result =
        tmaCashInReverseEventLogStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('');
    });
    it('TMA getAdditionalDetail', async () => {
      const result = tmaCashInReverseEventLogStrategy.getAdditionalDetail(
        mockEventObject,
        [{ key: 'destiny_account', value: '' }],
      );
      expect(result).toEqual([
        {
          key: 'destiny_account',
          value: '123456',
        },
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
        {
          key: 'reference1',
          value: '',
        },
        {
          key: 'reference2',
          value: '000000000000000000000',
        },
        {
          key: 'reference3',
          value: '                         ',
        },
        {
          key: 'bank_origin',
          value: '0097',
        },
        {
          key: 'account_type',
          value: 'SDA',
        },
      ]);
    });
    it('TMA getgetOperators', async () => {
      const result =
        tmaCashInReverseEventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
    it('should return the same eventObject', () => {
      const result =
        tmaCashInReverseEventLogStrategy.doAlgorithm(mockEventObject);
      expect(result).toBe(mockEventObject);
    });
  });
});
