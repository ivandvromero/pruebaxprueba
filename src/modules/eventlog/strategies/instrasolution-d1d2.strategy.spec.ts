//Strategies
import { IntrasolutionD1D2EventLogStrategy } from './instrasolution-d1d2.strategy';

import {
  mockDateInformation,
  mockEventObject,
  mockSmsKeys,
} from '../../../../test/mock-data';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

describe('IntrasolutionD1D2EventLogStrategy', () => {
  let daleNotificationServiceMock: any;
  let intrasolutionD1D2EventLogStrategy: IntrasolutionD1D2EventLogStrategy;

  beforeEach(() => {
    daleNotificationServiceMock = {
      getDateInformation: jest.fn().mockReturnValue(mockDateInformation),
      getSmsKeys: jest.fn().mockReturnValue(mockSmsKeys),
      sendSmsNotification: jest.fn(),
    };

    intrasolutionD1D2EventLogStrategy = new IntrasolutionD1D2EventLogStrategy(
      daleNotificationServiceMock,
    );
  });

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
          TypeTransactionEventLog[mockEventObject.RQ.messageRQ.digitalService],
      },
      {
        key: 'tx_id_dale1',
        value: mockEventObject.RQ.messageRQ.transactionId,
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

  it('should send SMS notification if status code is 0', async () => {
    await intrasolutionD1D2EventLogStrategy.sendSmsNotification(
      mockEventObject,
    );
    expect(
      daleNotificationServiceMock.getDateInformation,
    ).toHaveBeenCalledTimes(1);
    expect(daleNotificationServiceMock.getSmsKeys).toHaveBeenCalledTimes(1);
    expect(
      daleNotificationServiceMock.sendSmsNotification,
    ).toHaveBeenCalledTimes(1);
    expect(
      daleNotificationServiceMock.sendSmsNotification,
    ).toHaveBeenCalledWith(
      mockEventObject,
      '57',
      '3333333333',
      false,
      '012',
      mockSmsKeys,
    );
  });

  it('should not send SMS notification if status code is not 0', async () => {
    mockEventObject.RS.statusRS.code = 'MAMBU_905';
    await intrasolutionD1D2EventLogStrategy.sendSmsNotification(
      mockEventObject,
    );
    expect(
      daleNotificationServiceMock.getDateInformation,
    ).not.toHaveBeenCalled();
    expect(daleNotificationServiceMock.getSmsKeys).not.toHaveBeenCalled();
    expect(
      daleNotificationServiceMock.sendSmsNotification,
    ).not.toHaveBeenCalled();
  });
  it('should return the same eventObject', () => {
    const result =
      intrasolutionD1D2EventLogStrategy.doAlgorithm(mockEventObject);
    expect(result).toBe(mockEventObject);
  });
});
