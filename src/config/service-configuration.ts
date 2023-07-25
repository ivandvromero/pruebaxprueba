import {
  SENSITIVE,
  USER_ID,
} from '@dale/shared-nestjs/config/masking-strategies';

export default () => ({
  service: {
    node_env: process.env.NODE_ENV,
    type: process.env.SERVICE_TYPE,
    name: process.env.SERVICE_NAME,
    port: process.env.MONITOR_SERVICE_PORT,
    cloud_service_provider: process.env.CLOUD_SERVICE_PROVIDER,
    auditable: process.env.ENABLE_AUDIT,
    disable_mask: process.env.DISABLE_MASK,
  },
  aws: {
    region: process.env.AWS_REGION,
    xray_daemon_address: process.env.AWS_XRAY_DAEMON_ADDRESS,
    private_key: process.env.CERTIFICATE_PRIVATE_KEY,
    public_key: process.env.PUBLIC_CERTIFICATE,
  },
  kafkapts: {
    kafka_ssl: process.env.KAFKA_SSL_ENABLED_PTS,
    kafka_url: process.env.KAFKA_URLS_PTS,
    sasl_username: process.env.SASL_USERNAME_PTS,
    sasl_password: process.env.SASL_PASSWORD_PTS,
    retries: parseInt(process.env.KAFKA_RETRIES),
    retry: process.env.KAFKA_RETRY_POLICY_PTS,
    topic: process.env.KAFKA_TOPIC_PTS,
  },
  kafka: {
    kafka_ssl: process.env.KAFKA_SSL_ENABLED,
    kafka_url: process.env.KAFKA_URLS,
    sasl_username: process.env.SASL_USERNAME,
    sasl_password: process.env.SASL_PASSWORD,
    retry: process.env.KAFKA_RETRY_POLICY,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls_enable: process.env.REDIS_TLS_ENABLED,
    auth_token: process.env.REDIS_AUTH_TOKEN,
    ttl: parseInt(process.env.REDIS_TTL),
  },
  crm: {
    crm_service_url: process.env.CRM_SERVICE_URL,
    user: process.env.CRM_USERNAME,
    password: process.env.CRM_PASSWORD,
  },
  sqs: {
    queue_url: process.env.SQS_URL,
  },
  eventlog: {
    event_log_version: process.env.EVENT_LOG_VERSION,
    event_log_mnemonic: process.env.EVENT_LOG_MNEMONIC,
    event_log_debitcode: process.env.EVENT_LOG_DEBITCODE,
    event_log_creditcode: process.env.EVENT_LOG_CREDITCODE,
    event_log_debitname: process.env.EVENT_LOG_DEBITNAME,
    event_log_creditname: process.env.EVENT_LOG_CREDITNAME,
    event_log_application: process.env.EVENT_LOG_APPLICATION,
    event_log_channel: process.env.EVENT_LOG_CHANNEL,
    cashin_pse_event_log_name: process.env.CASHIN_PSE_EVENT_LOG_NAME,
    cashin_pse_event_log_mnemonic: process.env.CASHIN_PSE_EVENT_LOG_MNEMONIC,
    cashin_pse_event_log_code: process.env.CASHIN_PSE_EVENT_LOG_CODE,
  },
  card: {
    card_service_url: process.env.CARD_SERVICE_URL,
  },
});

export const maskingConfig = {
  kafka: {
    sasl_username: USER_ID,
    sasl_password: SENSITIVE,
  },
  database: {
    typeorm_tokenization_username: USER_ID,
    typeorm_user_password: SENSITIVE,
  },
  redis: {
    auth_token: SENSITIVE,
  },
  crm: {
    user: USER_ID,
    password: SENSITIVE,
  },
};
