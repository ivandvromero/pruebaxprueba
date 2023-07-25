import { KafkaOptions, Transport } from '@nestjs/microservices';
import serviceConfiguration from './configuration';
import { SASLMechanism } from 'kafkajs';
import { SASLOptions } from '@nestjs/microservices/external/kafka.interface';

const client = {
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
          mechanism: 'scram-sha-512' as SASLMechanism,
          username: serviceConfiguration().kafka.sasl_username,
          password: serviceConfiguration().kafka.sasl_password,
        } as SASLOptions,
      }
    : {}),
};

export const KAFKA_CLIENT_CONFIG: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: `${serviceConfiguration().service.name}`,
      ...client,
    },
    consumer: {
      groupId: `${serviceConfiguration().service.name}-group`,
    },
  },
};
