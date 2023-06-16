import { SQS } from 'aws-sdk';
import { ParamsSQS, MessageAttributes } from '../shared/types/params-sqs.type';
import { SQS_DELAY_SECONDS, SQS_QUEUE_URL } from '../shared/constants/aws';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../shared/manage-errors/code-erros/error-codes.enum';

export const sendMessage = async (params: ParamsSQS): Promise<any> => {
  try {
    const client = new SQS();
    const delaySeconds = params?.DelaySeconds
      ? params.DelaySeconds
      : SQS_DELAY_SECONDS;

    const config = {
      DelaySeconds: delaySeconds,
      MessageBody: params.MessageBody,
      QueueUrl: SQS_QUEUE_URL,
      MessageAttributes: getAtributes(params.MessageAttributes),
    };

    const response = await client.sendMessage(config, (error, data) => {
      if (error) {
        return new InternalServerExceptionDale(ErrorCodesEnum.MON020, error);
      }
      return data;
    });
    return response;
  } catch (error) {
    throw new InternalServerExceptionDale(ErrorCodesEnum.MON020, error);
  }
};

const getAtributes = (
  messageAttributes: MessageAttributes,
): MessageAttributes => {
  const atributes = {};

  if (
    messageAttributes?.Title?.DataType &&
    messageAttributes?.Title?.StringValue
  ) {
    atributes['Title'] = messageAttributes.Title;
  }

  if (
    messageAttributes?.Author?.DataType &&
    messageAttributes?.Author?.StringValue
  ) {
    atributes['Author'] = messageAttributes.Author;
  }

  if (
    messageAttributes?.WeeksOn?.DataType &&
    messageAttributes?.WeeksOn?.StringValue
  ) {
    atributes['WeeksOn'] = messageAttributes.WeeksOn;
  }

  return atributes as MessageAttributes;
};
