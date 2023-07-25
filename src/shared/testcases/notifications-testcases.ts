import { CreateNotificationDto } from '@dale/notifications/dto/create-notification.dto';
import { NotificationEntity } from '@dale/notifications/repositories/notifications/notifications.entity';
import { PaginationNotificationResponse } from '@dale/notifications/shared/common/get-notification-response';

export const createNotification: CreateNotificationDto = {
  toUser: 'capturer@test.com',
  relatedId: 'anAdjustmentId',
  relatedType: 'single-adjustment',
  title: 'Nuevo ajuste individual por verificar',
  description: 'No. depósito electrónico: ABC123',
  notificationType: false,
};

export const respCreateNotification: NotificationEntity = {
  toUser: 'capturer@test.com',
  relatedId: 'anAdjustmentId',
  relatedType: 'single-adjustment',
  title: 'Nuevo ajuste individual por verificar',
  description: 'No. depósito electrónico: ABC123',
  notificationType: false,
  createdAt: new Date('2023-06-23T19:39:00.329Z'),
  notifiedAt: null,
  viewedAt: null,
  attendedAt: null,
  id: 'an Id',
};

export const notificationsPaginated = new PaginationNotificationResponse(
  [respCreateNotification],
  1,
);

export const notificationRelatedId = 'anAdjustmentId';
export const notificationId = 'an Id';

export const notificationEmail = 'capturer@test.com';
export const notificationSocketId = 'anSocketId';
