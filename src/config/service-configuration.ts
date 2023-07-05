import {
  SENSITIVE,
  USER_ID,
} from '@dale/shared-nestjs/config/masking-strategies';

export default () => ({
  service: {
    node_env: process.env.NODE_ENV,
    type: process.env.SERVICE_TYPE,
    name: process.env.SERVICE_NAME,
    port: process.env.USER_SERVICE_PORT,
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
  kafka: {
    kafka_ssl: process.env.KAFKA_SSL_ENABLED,
    kafka_url: process.env.KAFKA_URLS,
    sasl_username: process.env.SASL_USERNAME,
    sasl_password: process.env.SASL_PASSWORD,
    retry: process.env.KAFKA_RETRY_POLICY,
  },
  database: {
    typeorm_host: process.env.TYPEORM_HOST,
    typeorm_port: process.env.TYPEORM_PORT,
    typeorm_tokenization_username: process.env.TYPEORM_USER_USERNAME,
    typeorm_user_password: process.env.TYPEORM_USER_PASSWORD,
    typeorm_user_database: process.env.TYPEORM_USER_DATABASE,
    db_rotating_key: process.env.DB_ROTATING_KEY,
    db_connection_refresh_minutes: process.env.DB_CONNECTION_REFRESH_MINUTES,
    db_ssl_enabled: process.env.DB_SSL_ENABLED,
  },
  providers: {
    enrollment_np_service: process.env.ENROLLMENT_NATURAL_PERSON_SERVICE_URL,
  },
  max_attempts_topic: {
    update_user_db: 3,
  },
});

export const maskingConfig: any = {
  kafka: {
    sasl_username: USER_ID,
    sasl_password: SENSITIVE,
  },
  database: {
    typeorm_tokenization_username: USER_ID,
    typeorm_user_password: SENSITIVE,
  },
};
