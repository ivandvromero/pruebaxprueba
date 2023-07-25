import { NotificationsRepository } from '@dale/notifications/repositories/notifications/notifications.repository';
import { Injectable, Optional } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Logger } from '@dale/logger-nestjs';
import { NotificationsGateway } from '../gateways/notifications.gateways';
import { ClientManagerGateway } from './client-manager-gateway.service';

@Injectable()
export class CreateNotificationService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly clientManagerGateway: ClientManagerGateway,
    @Optional() private logger: Logger,
  ) {}

  async run(createNotification: CreateNotificationDto): Promise<boolean> {
    this.logger.debug('Create notification service started');
    const createdNotification =
      await this.notificationsRepository.createNotification(createNotification);
    const { toUser } = createdNotification;
    const clientId = await this.clientManagerGateway.findClient(toUser);
    if (clientId) {
      const notifications = await this.notificationsRepository.getNotifications(
        toUser,
      );
      await this.notificationsGateway.server
        .to(clientId)
        .emit('notifications', notifications);
    }
    return true;
  }
}
