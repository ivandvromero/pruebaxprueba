import configuration from '../../../config/service-configuration';

export const PTS_BASE_URL = configuration().pts.base_url;
export const PTS_USER_LOGIN = configuration().pts.user;
export const PTS_PASS_LOGIN = configuration().pts.password;
export const PTS_REFRESH_TOKEN = configuration().pts.pts_refresh_token;

export const endpointsPTS = {
  LIMITS_ACCUMULATORS: '/RSAdaptorFE/api/v1/administratives/account/',
  TOKEN_URL: '/adaptorOAS/auth/login',
  EMBARGAR_DEPOSIT: '/RSAdaptorFE/api/v2/own-channels/administratives/account',
  MODIFY_LIMITS:
    '/RSAdaptorFE/api/v2/own-channels/administratives/limits/0/assign-accumulator-dale',
  TYPE_ACCOUNT: 'MAMBU',
};

export const headersToken = {
  contentType: 'application/x-www-form-urlencoded',
  channel: 'BACKOFFICE',
  authorization: 'Basic',
  grantType: 'client_credentials',
};
