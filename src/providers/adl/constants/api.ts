import configuration from '../../../config/service-configuration';
export const ADL_AUGUSTA_API = configuration().adl.adl_augusta_api;
export const ADL_AUGUSTA_API_KEY = configuration().adl.adl_augusta_api_key;

export const endpointsADL = {
  ADL_AUTH: '/v1/auth',
  ADL_CHECK_TRX: '/v1/check/trx',
  ADL_CHECK_REPORT: '/v1/check/report',
};
