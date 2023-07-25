import { v4 as uuid } from 'uuid';
import { getServiceIp } from '../../utils/get-service-ip';
import { HeaderDTO } from '../dto/header.dto';

const ip = getServiceIp();
const [key] = Object.keys(ip);
const [ipNest] = ip[key];
export const HEADERS: HeaderDTO = {
  ApiVersion: 1,
  TransactionId: uuid(),
  ChannelId: 'MONITOR-NESTJS-MS',
  SessionId: uuid(),
  Timestamp: new Date().toISOString(),
  IpAddress: ipNest,
  Application: 'MonitorService',
};
