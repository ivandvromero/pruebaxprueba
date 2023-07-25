export class GetNotificationDto {
  id: string;
  createAt: Date;
  notifiedAt: Date;
  viewedAt: Date;
  attendedAd?: Date;
  title: string;
  description: string;
  notificationType: boolean;
  relatedType: string;
}
