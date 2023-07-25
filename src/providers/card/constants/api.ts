import configuration from '../../../config/service-configuration';

export const CARD_SERVICE_URL = configuration().card.card_service_url;

export const endpoints = {
  BASIC: '/cards/information/basic/',
};
