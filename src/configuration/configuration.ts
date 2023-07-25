import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    service: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.SERVICE_PORT,
      name: process.env.SERVICE_NAME,
    },
    typeOrm: {
      type: process.env.TYPEORM_CONNECTION,
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      database: process.env.DB_POSTGRESQL_NAME,
      username: process.env.TYPEORM_BACKOFFICE_USERNAME,
      password: process.env.TYPEORM_USER_PASSWORD,
    },
    mambu: {
      apiKey: process.env.MAMBU_API_KEY,
      rootPath: process.env.MAMBU_ROOT_PATH,
      acceptHeader: process.env.MAMBU_ACCEPT_HEADER,
    },
    crm: {
      username: process.env.CRM_USERNAME,
      password: process.env.CRM_PASSWORD,
      url: process.env.CRM_SERVICE_URL,
    },
    pts: {
      pchannel: process.env.PTS_PCHANNEL,
      authorization: process.env.PTS_AUTHORIZATION,
      rootPath: process.env.PTS_ROOT_PATH,
      baseUrl: process.env.PTS_API_URL,
      user: process.env.PTS_USER,
      password: process.env.PTS_PWD,
      refreshTokenTime: process.env.PTS_REFRESH_TOKEN,
    },
    auth: {
      url: process.env.AUTH0_ISSUER_URL,
      audience: process.env.AUTH0_AUDIENCE,
      rootPath: process.env.AUTH0_CONNECTOR,
      clientId: process.env.AUTH0_ID,
      authSecret: process.env.AUTH0_SECRET,
      autorization: process.env.AUTH0_TOKEN,
    },
    aws: {
      region: process.env.AWS_REGION,
      xray_daemon_address: process.env.AWS_XRAY_DAEMON_ADDRESS,
      private_key: process.env.CERTIFICATE_PRIVATE_KEY,
      public_key: process.env.PUBLIC_CERTIFICATE,
    },
    massiveAdjustments: {
      limit: process.env.MASSIVE_ADJUSTMENTS_LIMIT,
    },
    secrets: {
      secretName: process.env.SECRET_PATH_GENERATE_KEY_SYMMETRIC_AUDMON,
    },
    kafka: {
      kafka_ssl: process.env.KAFKA_SSL_ENABLED,
      kafka_url: process.env.KAFKA_URLS,
      sasl_username: process.env.SASL_USERNAME,
      sasl_password: process.env.SASL_PASSWORD,
      retry: process.env.KAFKA_RETRY_POLICY,
    },
  };
});
