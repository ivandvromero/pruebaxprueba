import { ApiProperty } from '@nestjs/swagger';
import { NotificationEntity } from '../../repositories/notifications/notifications.entity';

export class GetNotificationResponse {
  @ApiProperty({
    example: '033613a6-e4b4-4733-97b2-025e8f8df7b6',
    description: 'Unique id of the notification',
  })
  id: string;
  relatedType: string;
  @ApiProperty({
    example: 'Nuevo ajuste individual por verificar',
    description: 'Title notification',
  })
  title: string;
  @ApiProperty({
    example: 'COU0004',
    description: 'Transaction channel',
  })
  description: string;
  @ApiProperty({
    example: 'backoffice-validator@yopmail.com',
    description: 'User to Auth0',
  })
  createdAt: Date;
  @ApiProperty({
    example: 'asdf-9823dsdsds-232343344',
    description: 'Electronic deposit associated with the phone number',
  })
  viewedAt: null | Date;

  constructor(notifications: NotificationEntity) {
    const { id, relatedType, title, description, createdAt, viewedAt } =
      notifications;

    this.id = id;
    this.relatedType = relatedType;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.viewedAt = viewedAt;
  }
}

export class PaginationNotificationResponse {
  @ApiProperty({
    type: [GetNotificationResponse],
    description: 'Array of notifications',
  })
  results: GetNotificationResponse[];
  @ApiProperty({
    example: '50',
    description: 'Total of notifications in database',
  })
  total: number;
  constructor(notifications: NotificationEntity[], count: number) {
    this.results = notifications.map(
      (notifications) => new GetNotificationResponse(notifications),
    );
    this.total = count;
  }
}
