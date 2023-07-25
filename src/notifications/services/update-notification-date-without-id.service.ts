import { NotificationsRepository } from '@dale/notifications/repositories/notifications/notifications.repository';
import { DateToUpdateEnum } from '@dale/notifications/shared/enums/date-to-update.enum';
import { Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { NotificationsGateway } from '../gateways/notifications.gateways';
import { ClientManagerGateway } from './client-manager-gateway.service';

@Injectable()
export class UpdateNotificationWithoutIdService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly clientManagerGateway: ClientManagerGateway,
    @Optional() private logger: Logger,
  ) {}

  async run(
    adjustmentId: string,
    email: string,
    dateToUpdate: DateToUpdateEnum,
  ): Promise<boolean> {
    this.logger.debug('Update notifications date without id service started');
    const notification = await this.notificationsRepository.findNotification(
      adjustmentId,
      email,
    );
    if (notification) {
      const { toUser } = notification;
      await this.notificationsRepository.updateNotificationsDate(
        notification.id,
        dateToUpdate,
      );
      let clientId;
      if (dateToUpdate !== DateToUpdateEnum.NOTIFIED_AT) {
        clientId = await this.clientManagerGateway.findClient(toUser);
      }
      if (clientId) {
        const notifications =
          await this.notificationsRepository.getNotifications(toUser);
        await this.notificationsGateway.server
          .to(clientId)
          .emit('notifications', notifications);
      }
      return true;
    }

    return false;
  }
}
