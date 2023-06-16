import configuration from '../config/service-configuration';

export const KafkaTopicsConstants = {
  PTS_TOPIC_PTS: configuration().kafkapts.topic,
  NOTIFICATION_SMS: 'notification.create.sms',
};

export const kafkaRetries = configuration().kafkapts.retries;

export const event_log_debitcode = Number(
  configuration().eventlog.event_log_debitcode,
);
export const event_log_creditcode = Number(
  configuration().eventlog.event_log_creditcode,
);
export const event_log_debitname = configuration().eventlog.event_log_debitname;
export const event_log_creditname =
  configuration().eventlog.event_log_creditname;
