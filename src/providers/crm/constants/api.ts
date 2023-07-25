import configuration from '../../../config/service-configuration';

export const CRM_SERVICE_URL = configuration().crm.crm_service_url;
export const CRM_USERNAME = configuration().crm.user;
export const CRM_PASSWORD = configuration().crm.password;

export const endpoints = {
  CONTACT: '/crmRestApi/resources/latest/contacts/',
  DEPOSIT: '/crmRestApi/resources/latest/dl_Depositos_c?q=dl_Contacto_Id_c=',
};
