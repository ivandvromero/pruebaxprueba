import { SqsLogTypeEnum } from '../enums/log-type.enum';

export const sqsConstants = {
  [SqsLogTypeEnum.CREATE_USER]: {
    info: {
      version: '3.0',
      eventCode: 11,
      eventMnemonic: 'TRSCUPN',
      eventName: 'CREATE_USER',
    },
  },
};
