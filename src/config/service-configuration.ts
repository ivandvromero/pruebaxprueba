import {
  SENSITIVE,
  USER_ID,
} from '@dale/shared-nestjs/config/masking-strategies';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
const filename = process.env.NODE_ENV === 'test' ? 'test.env' : 'dev.env';
const tsPath = path.resolve(__dirname, `../../../${filename}`);
const jsPath = path.resolve(__dirname, `../../../${filename}`);
dotenv.config({ path: fs.existsSync(tsPath) ? tsPath : jsPath });

export default () => {
  return {
    service: {
      node_env: process.env.NODE_ENV,
      type: process.env.SERVICE_TYPE,
      name: process.env.SERVICE_NAME,
      port: process.env.SERVICE_PORT,
      cloud_service_provider: process.env.CLOUD_SERVICE_PROVIDER,
      auditable: process.env.ENABLE_AUDIT,
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
      topic_update: process.env.TOPIC_KAFKA_BACKOFFICE,
      topic_mambu: process.env.KAFKA_MAMBU,
    },
    database: {
      typeorm_host: process.env.TYPEORM_HOST,
      typeorm_port: process.env.TYPEORM_PORT,
      typeorm_tokenization_username: process.env.TYPEORM_ACCOUNT_USERNAME,
      typeorm_account_password: process.env.TYPEORM_USER_PASSWORD,
      typeorm_account_database: process.env.TYPEORM_ACCOUNT_DATABASE,
      db_rotating_key: process.env.DB_ROTATING_KEY,
      db_connection_refresh_minutes: process.env.DB_CONNECTION_REFRESH_MINUTES,
      db_ssl_enabled: process.env.DB_SSL_ENABLED,
    },
    pts: {
      base_url: process.env.PTS_API_URL,
      user: process.env.PTS_USER,
      password: process.env.PTS_PWD,
      pts_refresh_token: process.env.PTS_REFRESH_TOKEN,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 86400,
      tls_enable: process.env.REDIS_TLS_ENABLED,
      auth_token: process.env.REDIS_AUTH_TOKEN,
    },
    mambu: {
      mambu_base_url: process.env.MAMBU_URL,
      mambu_api_key: process.env.MAMBU_API_KEY,
    },
    adl: {
      adl_augusta_api: process.env.ADL_AUGUSTA_API,
      adl_augusta_api_key: process.env.ADL_AUGUSTA_API_KEY,
    },
    ath: {
      ath_url: process.env.ATH_URL,
    },
    max_attempts_topic: {
      create_account_pts: 3,
      create_account_db: 3,
      update_account_db: 3,
    },
    crm: {
      base_url: process.env.CRM_API_URL,
      user: process.env.CRM_USER,
      password: process.env.CRM_PWD,
    },
  };
};

export const maskingConfig = {
  pts: {
    user: USER_ID,
    password: SENSITIVE,
  },
  aws: {
    private_key: SENSITIVE,
    public_key: SENSITIVE,
  },
};
