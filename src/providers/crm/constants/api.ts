import configuration from '../../../config/service-configuration';

export const CRM_BASE_URL = configuration().crm.base_url;
export const CRM_USER_LOGIN = configuration().crm.user;
export const CRM_PASS_LOGIN = configuration().crm.password;

export const endpointsCRM = {
  CONSULT_ELECTRONIC_DEPOSIT: '/crmRestApi/resources/latest/dl_Depositos_c',
};

export const headersToken = {
  contentType: 'application/x-www-form-urlencoded',
  channel: 'BACKOFFICE',
  authorization: 'Basic',
  grantType: 'client_credentials',
};
