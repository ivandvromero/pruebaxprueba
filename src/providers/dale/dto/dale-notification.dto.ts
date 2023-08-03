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
  keys: [
    {
      Key: string;
      Value: string;
    },
  ];
}
