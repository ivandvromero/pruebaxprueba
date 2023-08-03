import { KafkaOptions, Transport } from '@nestjs/microservices';
import serviceConfiguration from './service-configuration';

export const KAFKA_CLIENT_CONFIG: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    subscribe: {
      fromBeginning: true,
    },
    consumer: {
      groupId: `${serviceConfiguration().service.name}-group`,
    },
    client: {
      clientId: serviceConfiguration().service.name,
      retry: {
        initialRetryTime: 5000,
        factor: 2,
        retries: Number(serviceConfiguration().kafka.retry),
      },
      brokers: serviceConfiguration().kafka.kafka_url
        ? serviceConfiguration().kafka.kafka_url.split(',')
        : [],
      ...(serviceConfiguration().kafka.kafka_ssl === 'true'
        ? {
            ssl: true,
            sasl: {
              mechanism: 'scram-sha-512',
              username: process.env.SASL_USERNAME,
              password: process.env.SASL_PASSWORD,
            },
          }
        : {}),
    },
  },
};
