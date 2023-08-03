import { v4 as uuid } from 'uuid';
import { HeadersEvent } from '../dtos/events.dto';
import serviceConfiguration from 'src/config/service-configuration';
import { getCurrentColombiaTime } from '@dale/shared-nestjs/utils/date';

export const mapKafkaHeadersToDto = (
  headers?: Record<any, any>,
): HeadersEvent => {
  const headerDTO = new HeadersEvent();
  try {
    headerDTO.transactionId = headers['transactionId']?.toString() || uuid();
    headerDTO.channelId = headers['channelId']?.toString() || 'Kafka';
    headerDTO.sessionId = headers['sessionId']?.toString() || undefined;
    headerDTO.timestamp =
      headers['timestamp']?.toString() || getCurrentColombiaTime();
    headerDTO.ipAddress = headers['ipAddress']?.toString() || '';
    headerDTO.application = headers['application']?.toString() || 'Kafka';
    headerDTO.attempts = headers['attempts'] || '0';
    headerDTO['user-agent'] = headers['user-agent'] || '';
    return headerDTO;
  } catch (error) {
    return headerDTO;
  }
};

export const prepareHeadersForQueue = (headers: HeadersEvent): HeadersEvent => {
  const headersForQueue: HeadersEvent = {
    transactionId: headers.transactionId,
    channelId: headers.channelId,
    sessionId: headers.sessionId,
    timestamp: getCurrentColombiaTime(),
    ipAddress: headers.ipAddress,
    application: serviceConfiguration().service.name,
    attempts: '0',
    'user-agent': headers['user-agent'],
  };
  clearObject(headersForQueue);
  return headersForQueue;
};

export const clearObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
};
