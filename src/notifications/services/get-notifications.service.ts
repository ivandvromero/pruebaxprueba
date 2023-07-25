import { NotificationsRepository } from '@dale/notifications/repositories/notifications/notifications.repository';
import { PaginationNotificationResponse } from '@dale/notifications/shared/common/get-notification-response';
import { Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';

@Injectable()
export class GetNotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    @Optional() private logger: Logger,
  ) {}

  async run(email: string): Promise<PaginationNotificationResponse> {
    this.logger.debug('Get notifications service  started');
    const result = await this.notificationsRepository.getNotifications(email);
    return result;
  }
}
