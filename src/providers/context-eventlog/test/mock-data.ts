export const mockEventResponseIntra = {
  message: 'Mensaje enviado exitosamente',
  httpStatusCode: 200,
};
export const mockEventResponseIntraFail = {
  httpStatusCode: 400,
  message: [],
};
export const auditLog = {
  application: 'DALE 2.0',
  clientId: '20230200134',
  clientIdType: '2',
  channel: 'PTS INTEGRADOR',
  transactionId: '2334',
  requestId: 'b59a145f-28ed-4652-8b2d-bf79606ebc60',
  ipAddress: 'x.x.x.x',
  sessionId: '2334',
};
export const auditLogVoid = {
  application: '',
  clientId: '',
  clientIdType: '',
  channel: '',
  transactionId: '',
  requestId: '',
  ipAddress: '',
  sessionId: '',
};
export const userAgentVoid = {
  userAgent: '',
};
const userAgent = {
  userAgent:
    'app-dale/1.6.7.42 Dalvik/2.1.0 (Linux; U; Android 5.1.1; Android SDK built for x86 Build/LMY48X)',
};
export const mockBaseEventLogIntraArray = [
  {
    audit: auditLogVoid,
    details: [],
    eventCode: 100,
    eventMnemonic: 'TRFINTRCR',
    eventName: 'MONEY_TRANSFER_CORE',
    result: true,
    source: userAgentVoid,
    timestamp: '',
    version: '3.0',
  },
  {
    audit: auditLogVoid,
    details: [],
    eventCode: 102,
    eventMnemonic: 'TRFINTRCR',
    eventName: 'RECEIVE_TRANSFER_CORE',
    result: true,
    source: userAgentVoid,
    timestamp: '',
    version: '3.0',
  },
];
export const mockBaseEventLogRetiroOtpArray = [
  {
    audit: auditLogVoid,
    details: [],
    eventCode: 100,
    eventMnemonic: 'TRFINTRCR',
    eventName: 'MONEY_TRANSFER_CORE',
    result: true,
    source: userAgentVoid,
    timestamp: '',
    version: '3.0',
  },
];
export const mockBaseEventLogRetiroOtpReversoArray = [
  {
    audit: auditLogVoid,
    details: [],
    eventCode: 102,
    eventMnemonic: 'TRFINTRCR',
    eventName: 'RECEIVE_TRANSFER_CORE',
    result: true,
    source: userAgentVoid,
    timestamp: '',
    version: '3.0',
  },
];
export const mockBaseEventLogEnviarArray = [
  {
    audit: auditLogVoid,
    details: [],
    eventCode: 102,
    eventMnemonic: 'TRFINTRCR',
    eventName: 'RECEIVE_TRANSFER_CORE',
    result: true,
    source: userAgentVoid,
    timestamp: '',
    version: '3.0',
  },
];
export const mockBaseEventLogRecibirArray = [
  {
    audit: auditLogVoid,
    details: [],
    eventCode: 102,
    eventMnemonic: 'TRFINTRCR',
    eventName: 'RECEIVE_TRANSFER_CORE',
    result: true,
    source: userAgentVoid,
    timestamp: '',
    version: '3.0',
  },
];
export const mockResultEventLogArray = [
  {
    audit: auditLog,
    details: [],
    eventCode: 100,
    eventMnemonic: 'TRFINTRCR',
    eventName: 'MONEY_TRANSFER_CORE',
    result: true,
    source: userAgent,
    timestamp: '2023-03-04T19:37:02Z',
    version: '3.0',
  },
];
export const mockEventResponseErrorIntra = [
  { httpStatusCode: 403, message: 'ExpiredToken' },
];
