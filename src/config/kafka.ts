import { KafkaOptions, Transport } from '@nestjs/microservices';
import serviceConfiguration from './service-configuration';
import { SASLMechanism } from 'kafkajs';
import { SASLOptions } from '@nestjs/microservices/external/kafka.interface';

console.log('Kafka URL:', serviceConfiguration().kafka.kafka_url);
console.log('Kafka retry:', serviceConfiguration().kafka.retry);
const clientPts = {
  retry: {
    initialRetryTime: 5000,
    factor: 2,
    retries: Number(serviceConfiguration().kafkapts.retry),
  },
  brokers: serviceConfiguration().kafkapts.kafka_url
    ? serviceConfiguration().kafkapts.kafka_url.split(',')
    : [],
  ...(serviceConfiguration().kafkapts.kafka_ssl === 'true'
    ? {
        ssl: true,
        sasl: {
          mechanism: 'scram-sha-512' as SASLMechanism,
          username: serviceConfiguration().kafkapts.sasl_username,
          password: serviceConfiguration().kafkapts.sasl_password,
        } as SASLOptions,
      }
    : {}),
};

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

export const KAFKA_CLIENT_PTS_CONFIG_MONITOR: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: `${serviceConfiguration().service.name}-monitor`,
      ...clientPts,
    },
    consumer: {
      groupId: `${serviceConfiguration().service.name}-monitor-group`,
    },
  },
};
export const KAFKA_CLIENT_PTS_CONFIG_EVENTLOG: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: `${serviceConfiguration().service.name}-eventlog`,
      ...clientPts,
    },
    consumer: {
      groupId: `${serviceConfiguration().service.name}-eventlog-group`,
    },
  },
};

export const KAFKA_CLIENT_PTS_CONFIG: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: `${serviceConfiguration().service.name}-pts`,
      ...clientPts,
    },
    consumer: {
      groupId: `${serviceConfiguration().service.name}-pts-group`,
    },
  },
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
