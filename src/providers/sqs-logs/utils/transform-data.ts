import { CreateUserLogEventDto } from '../dto/create-user-log-event.dto';
import { LogTypeEnum, SqsLogTypeEnum } from '../enums/log-type.enum';
import { sqsConstants } from './constants';

const getErrorData = (type, error) => {
  let code = 0;
  let message = '';
  if (type === LogTypeEnum.ERROR) {
    code = error.getResponse().code;
    message = error.message;
  }
  return [
    {
      key: 'code',
      value: code,
    },
    {
      key: 'message',
      value: message,
    },
  ];
};

export const transformMessageLog = (
  dataResponse: CreateUserLogEventDto<any>,
  type: string,
) => {
  const optionsType = {
    [SqsLogTypeEnum.CREATE_USER]: {
      details: [
        ...getErrorData(dataResponse.type, dataResponse.data.error),
        {
          key: 'attempt',
          value: dataResponse?.body?.attempt ?? '',
        },
        {
          key: 'destination',
          value: dataResponse?.body?.destination || 'PTS',
        },
        {
          key: 'phone',
          value: dataResponse?.body?.phone ?? '',
        },
        {
          key: 'response_identifier',
          value: dataResponse?.body?.responseIdentifier ?? '',
        },
      ],
    },
  };

  return { ...optionsType[type], ...sqsConstants[type].info };
};
