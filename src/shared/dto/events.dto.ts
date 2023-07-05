import { EnrollmentStatusEnum } from 'src/constants/common';

export class HeadersEvent {
  transactionId: string;
  channelId: string;
  sessionId?: string;
  timestamp: string;
  ipAddress: string;
  application: string;
  attempts?: string;
  'user-agent': string;
}

export class EventRequest<T> {
  value: T;
  headers: HeadersEvent;
  constructor(partial: Partial<EventRequest<T>>) {
    Object.assign(this, partial);
  }
}

export class FailedKafkaEventsValue<T> {
  topic: string;
  value: T;
  headers: HeadersEvent;
  attempts?: string;
  error: any;
  constructor(partial: Partial<FailedKafkaEventsValue<T>>) {
    Object.assign(this, partial);
  }
}

export class InsertEnrollmentQueueStepDataRequest {
  enrollmentId: string;
  step: string;
  data: any;
  actions: EnrollmentStepActions[];
}

export class EnrollmentStepActions {
  order: number;
  actionName: string;
  state: EnrollmentStatusEnum;
  response: string;
  constructor(partial: Partial<EnrollmentStepActions>) {
    Object.assign(this, partial);
  }
}
