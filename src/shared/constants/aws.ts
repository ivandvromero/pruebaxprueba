import configuration from '../../config/service-configuration';

export const SQS_QUEUE_URL = configuration().sqs.queue_url;
export const SQS_DELAY_SECONDS = 0;
