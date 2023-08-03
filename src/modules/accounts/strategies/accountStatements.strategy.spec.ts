//Strategies
import { AccountStatementsStrategy } from './accountStatements.strategy';

//Mock Data
import {
  mockHeaderDto,
  mockStatementsCheckTrxResponse,
  mockStatementsInputData,
  mockStatementsStrategyResponse,
} from '../../../../test/mock-data';

describe('Account Statements Strategy', () => {
  let accountStatementsStrategy: AccountStatementsStrategy;
  let ptsServiceMock: any;
  let accountDbServiceMock: any;
  let adlServiceMock: any;

  beforeEach(async () => {
    adlServiceMock = {
      checkTrx: jest.fn().mockReturnValue(mockStatementsCheckTrxResponse),
    };

    accountStatementsStrategy = new AccountStatementsStrategy(
      ptsServiceMock,
      accountDbServiceMock,
      adlServiceMock,
    );
  });

  it('should be defined', () => {
    expect(accountStatementsStrategy).toBeDefined();
  });
  describe('getInfo', () => {
    it('Success', async () => {
      const result = await accountStatementsStrategy.getInfo(
        mockStatementsInputData,
        mockHeaderDto,
      );
      expect(result).toEqual(mockStatementsStrategyResponse);
    });
  });
});
