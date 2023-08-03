import { SqsLogTypeEnum } from '../enums/log-type.enum';

export const sqsConstants = {
  [SqsLogTypeEnum.CREATE_ACCOUNT]: {
    info: {
      version: '3.0',
      eventCode: 10,
      eventMnemonic: 'TRSCAPN',
      eventName: 'CREATE_ACCOUNT',
    },
  },
};
