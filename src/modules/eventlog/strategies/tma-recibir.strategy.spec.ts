//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { TMARecibirEventLogStrategy } from './tma-recibir.strategy';
import { mockAdditionals, mockEventObject } from '../../../../test/mock-data';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('TMA Recibir EventLog Strategy', () => {
  let tmaRecibirStrategy: TMARecibirEventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TMARecibirEventLogStrategy],
    }).compile();
    tmaRecibirStrategy = module.get<TMARecibirEventLogStrategy>(
      TMARecibirEventLogStrategy,
    );
  });

  it('should be defined', () => {
    expect(tmaRecibirStrategy).toBeDefined();
  });
  describe('TMARecibirEventLogStrategy', () => {
    it('TMA getCellPhoneOrigin', async () => {
      const event = { ...mockEventObject };
      event.CFO['additionals'] = mockAdditionals;
      const result = tmaRecibirStrategy.getCellPhoneOrigin();
      expect(result).toEqual('');
    });

    it('TMA getCellPhoneDestiny', async () => {
      const result = tmaRecibirStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });

    it('TMA getAdditionalDetail', async () => {
      const result = tmaRecibirStrategy.getAdditionalDetail(
        mockEventObject,
        [],
      );
      expect(result).toEqual([
        {
          key: 'type',
          value: 'intrasolucion',
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
          value: '0001',
        },
        {
          key: 'document_number_origin',
          value: '',
        },
        {
          key: 'account_type',
          value: 'SDA',
        },
      ]);
    });

    it('TMA getgetOperators', async () => {
      const result = tmaRecibirStrategy.getOperators();
      expect(result).toBeDefined();
    });

    it('getAdditionalDetail', async () => {
      const idetailMock = [{ key: 'origin_account', value: '' }];
      const expected = [
        { key: 'origin_account', value: '3999999999' },
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
          value: '0001',
        },
        {
          key: 'document_number_origin',
          value: '',
        },
        {
          key: 'account_type',
          value: 'SDA',
        },
      ];
      const result = tmaRecibirStrategy.getAdditionalDetail(
        mockEventObject,
        idetailMock,
      );
      expect(result).toEqual(expected);
    });
  });
});
