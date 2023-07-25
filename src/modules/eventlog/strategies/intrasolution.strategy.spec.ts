//Libraries
import { Test, TestingModule } from '@nestjs/testing';

//Strategies
import { IntrasolutionEventLogStrategy } from './intrasolution.strategy';
import { mockEventObject } from '../../../../test/mock-data';

import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('Intrasolution Event log Strategy', () => {
  let intrasolutionStrategy: IntrasolutionEventLogStrategy;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntrasolutionEventLogStrategy],
    }).compile();
    intrasolutionStrategy = module.get<IntrasolutionEventLogStrategy>(
      IntrasolutionEventLogStrategy,
    );
  });

  it('should be defined', () => {
    expect(intrasolutionStrategy).toBeDefined();
  });
  describe('IntrasolutionEventLogStrategy', () => {
    it('Intrasolution getCellPhoneOrigin', async () => {
      const result = intrasolutionStrategy.getCellPhoneOrigin(mockEventObject);
      expect(result).toEqual('3186779266');
    });
    it('Intrasolution getCellPhoneDestiny', async () => {
      const result = intrasolutionStrategy.getCellPhoneDestiny(mockEventObject);
      expect(result).toEqual('3333333333');
    });
    it('Intrasolution getAdditionalDetail', async () => {
      const result = intrasolutionStrategy.getAdditionalDetail(
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

    it('Intrasolution getgetOperators', async () => {
      const result = intrasolutionStrategy.getOperators(mockEventObject);
      expect(result).toBeDefined();
    });
    it('should return the same eventObject', () => {
      const result = intrasolutionStrategy.doAlgorithm(mockEventObject);
      expect(result).toBe(mockEventObject);
    });
  });
});
