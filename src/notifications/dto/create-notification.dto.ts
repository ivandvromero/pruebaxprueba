export class CreateNotificationDto {
  toUser: string;
  relatedId: string;
  relatedType: string;
  title: string;
  description: string;
  notificationType: boolean;
  createdAt?: Date;
}
