import configuration from '../../../config/service-configuration';
import { AccountCertificateStrategy } from '../strategies/accountCertificate.strategy';
import { AccountStatementsStrategy } from '../strategies/accountStatements.strategy';

export const PTS_BASE_URL = configuration().pts.base_url;
export const PTS_USER_LOGIN = configuration().pts.user;
export const PTS_PASS_LOGIN = configuration().pts.password;
export const PTS_REFRESH_TOKEN = configuration().pts.pts_refresh_token;

export const endpointsPTS = {
  LIMITS_ACCUMULATORS: '/RSAdaptorFE/api/v2/administratives/account/',
  TOKEN_URL: '/adaptorOAS/auth/login',
};

export const headersToken = {
  contentType: 'application/x-www-form-urlencoded',
  channel: 'BACKOFFICE',
  authorization: 'Basic',
  grantType: 'client_credentials',
};

export const KafkaTopicsConstants = {
  PTS_TOPIC_CREATE_ACCOUNT: 'account.create.account.pts',
  TOPIC_CREATE_ACCOUNT: 'account.create.account',
  NOTIFICATION_SMS: 'notification.create.sms',
  CRM_TOPIC_UPDATE_CUSTOMER: 'customer.update.customer.crm',
  TOPIC_UPDATE_ACCOUNT: 'account.update.account',
  TOPIC_FAILED_REQUEST_QUEUE: 'failed.request.queue',
  TOPIC_ENROLLMENT_NANTURAL_PERSON_INSERT_STEP:
    'enrollmentnaturalperson.insert.step',
  BACKOFFICE_TOPIC: configuration().kafka.topic_update,
  BACKOFFICE_TOPIC_MAMBU: configuration().kafka.topic_mambu,
};

export const certitificateTypeStrategies = {
  accountCertificate: AccountCertificateStrategy,
  accountStatements: AccountStatementsStrategy,
};
