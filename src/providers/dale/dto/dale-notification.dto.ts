export class DaleNotificationPayload {
  Id?: number;
  IdEvent?: any;
  UserId: string;
  NotificationTypeCode: string;
  NotificationCode: string;
  Recipient: string;
  Message: string;
  SMSType: string;
  Resend: boolean;
  keys: Key[];
}
export class Key {
  Key: string;
  Value: string;
}

export class DateInfo {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
}
