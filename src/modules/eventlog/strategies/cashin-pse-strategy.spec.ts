import { Test, TestingModule } from '@nestjs/testing';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import {
  mockAdditionals,
  mockCashinPSEBaseEvent,
  mockEventObject,
} from '../../../../test/mock-data';
import { CashinPseStrategy } from './cashin-pse-strategy';

describe('cashint pse EventLog Strategy', () => {
  let cashInPseStrategy: CashinPseStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashinPseStrategy],
    }).compile();
    cashInPseStrategy = module.get<CashinPseStrategy>(CashinPseStrategy);
  });

  it('should be defined', () => {
    expect(CashinPseStrategy).toBeDefined();
  });

  describe('cashinPseEventLogStrategy', () => {
    it('cashinPse getCellPhoneOrigin', async () => {
      const event = { ...mockEventObject };
      event.CFO['additionals'] = mockAdditionals;
      const result = cashInPseStrategy.getCellPhoneOrigin(event);
      expect(result).toEqual('');
    });

    it('cashinPse getCellPhoneDestiny', async () => {
      const result = cashInPseStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });

    it('Transifya getAdditionalDetail', async () => {
      const result = cashInPseStrategy.getAdditionalDetail(mockEventObject, []);
      expect(result).toEqual([
        {
          key: 'type',
          value:
            TypeTransactionEventLog[
              mockEventObject.RQ.messageRQ.digitalService
            ],
        },
        {
          key: 'operation',
          value: 'internal',
        },
      ]);
    });

    it('cashinPse getgetOperators', async () => {
      const result = cashInPseStrategy.getOperators(mockEventObject);
      expect(result).toEqual(['COM0001', 'IVA1001', 'GMF1001']);
    });

    it('should return the same eventObject - non empty date_transaction', () => {
      const expected = { ...mockCashinPSEBaseEvent };
      const result = cashInPseStrategy.doAlgorithm(
        mockCashinPSEBaseEvent,
      );
      expect(result).toEqual(expected);
    });
  });
});
