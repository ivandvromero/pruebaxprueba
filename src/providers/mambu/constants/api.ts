import configuration from '../../../config/service-configuration';
import { mambu } from '../../../constants/common';

export const MAMBU_URL = configuration().mambu.mambu_base_url;
export const MAMBU_API_KEY = configuration().mambu.mambu_api_key;
export const MAMBU_ACCEPT = mambu.MAMBU_ACCEPT;

export const endpoints = {
  CLIENT: '/api/clients',
  DEPOSIT_ACCOUNT: '/api/deposits',
  UPLOAD_DOCUMENTS: '/api/documents',
  BALANCE_INQUIRY: '/balanceInquiry',
};
