//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { IntrasolutionD1D2EventLogStrategy } from './instrasolution-d1d2.strategy';

import { mockEventObject } from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('instrasolucion D1D2 Recibir EventLog Strategy', () => {
  let intrasolutionD1D2EventLogStrategy: IntrasolutionD1D2EventLogStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntrasolutionD1D2EventLogStrategy],
    }).compile();
    intrasolutionD1D2EventLogStrategy =
      module.get<IntrasolutionD1D2EventLogStrategy>(
        IntrasolutionD1D2EventLogStrategy,
      );
  });

  it('should be defined', () => {
    expect(intrasolutionD1D2EventLogStrategy).toBeDefined();
  });
  describe('intrasolutionD1D2EventLogStrategy', () => {
    it('getCellPhoneOrg', async () => {
      const result =
        intrasolutionD1D2EventLogStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('');
    });
    it('getCellPhoneDest', async () => {
      const result =
        intrasolutionD1D2EventLogStrategy.getCellPhoneDestiny(mockEventObject);
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
      ];
      const result = intrasolutionD1D2EventLogStrategy.getAdditionalDetail(
        mockEventObject,
        idetailMock,
      );
      expect(result).toEqual(expected);
    });
    it('getOperators', async () => {
      const result =
        intrasolutionD1D2EventLogStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
  });
});
