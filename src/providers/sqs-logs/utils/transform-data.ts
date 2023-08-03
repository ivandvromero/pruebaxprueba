import { SendMessageDto } from '../dto/sqs-logs.dto';
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
  dataResponse: SendMessageDto<any>,
  type: SqsLogTypeEnum,
) => {
  const optionsType = {
    [SqsLogTypeEnum.CREATE_ACCOUNT]: {
      details: [
        ...getErrorData(dataResponse.type, dataResponse.data.error),
        {
          key: 'attempt',
          value: dataResponse?.data?.attempt,
        },
        {
          key: 'destination',
          value: dataResponse?.body?.destination || 'PTS',
        },
        {
          key: 'phone',
          value: dataResponse?.body?.phone,
        },
        {
          key: 'aggremment',
          value: dataResponse?.body?.aggremment || 'DALE',
        },
        {
          key: 'response_identifier_MAMBU',
          value: dataResponse?.body?.mambuId ?? '',
        },
        {
          key: 'response_identifier_PTS',
          value: dataResponse?.body?.ptsId ?? '',
        },
        {
          key: 'type_account',
          value: dataResponse?.body?.accountType ?? '',
        },
      ],
    },
  };
  return { ...optionsType[type], ...sqsConstants[type].info };
};
