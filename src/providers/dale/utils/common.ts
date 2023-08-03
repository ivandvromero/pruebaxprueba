import { v4 as uuid } from 'uuid';
import { getServiceIp } from './get-service-ip';
export const createHeadersStructure = (
  IpAddress?: string,
  TransactionId = uuid(),
  ChannelId = 'Account',
  SessionId = uuid(),
  Timestamp = new Date().toISOString(),
  Application = 'Account',
  ApiVersion = 1,
) => {
  const ip = getServiceIp();
  const [key] = Object.keys(ip);
  const ipKeys = ip[key];
  const ipNest = ipKeys[0];
  IpAddress = ipNest ?? IpAddress;
  return {
    TransactionId,
    ChannelId,
    SessionId,
    Timestamp,
    IpAddress,
    Application,
    ApiVersion,
  };
};
