export class NotificationDto {
  id: string;
  toUser: string;
  relatedId: string;
  relatedType: string;
  title: string;
  createAt: Date;
  notifiedAt: Date;
  viewedAt: Date;
  attendedAd?: Date;
  description: string;
  notificationType: boolean;
}
