export interface NotificationInterface {
  id: string;
  toUser: string;
  relatedId: string;
  relatedType: string;
  title: string;
  description: string;
  notificationType: boolean;
  createdAt?: Date;
  notifiedAt?: Date;
  viewedAt?: Date;
  attendedAt?: Date;
}
