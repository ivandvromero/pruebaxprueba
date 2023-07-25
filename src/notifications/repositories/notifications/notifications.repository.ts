import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { Repository, IsNull } from 'typeorm';
import { NotificationEntity } from './notifications.entity';
import { Logger } from '@dale/logger-nestjs';
import { config } from '../../../shared/config/typeorm.config';
import { DateToUpdateEnum } from '@dale/notifications/shared/enums/date-to-update.enum';
import { PaginationNotificationResponse } from '../../shared/common/get-notification-response';
import { CreateNotificationDto } from '@dale/notifications/dto/create-notification.dto';

@Injectable()
export class NotificationsRepository implements OnModuleInit {
  private notificationsDB: Repository<NotificationEntity>;
  constructor(private dbService: DatabaseService, private logger: Logger) {}
  async onModuleInit() {
    await this.dbService.init(config, process.env.TYPEORM_BACKOFFICE_USERNAME);
    this.notificationsDB = this.dbService.getRepository(NotificationEntity);

    if (process.env.DB_ROTATING_KEY === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          process.env.TYPEORM_BACKOFFICE_DATABASE,
        );
        this.notificationsDB = this.dbService.getRepository(NotificationEntity);
      }, Number(process.env.DB_CONNECTION_REFRESH_MINUTES) * 60 * 1000);
    }
  }

  async isDbConnectionAlive(): Promise<boolean | string> {
    return this.dbService.isDbConnectionAlive();
  }

  async createNotification(
    createNotification: CreateNotificationDto,
  ): Promise<CreateNotificationDto> {
    this.logger.debug('Creating notification repository started');
    createNotification.createdAt = new Date();
    try {
      const newNotification = this.notificationsDB.create(createNotification);
      await this.notificationsDB.save(newNotification);
      return newNotification;
    } catch (error) {
      this.logger.error('Something went wrong creating a notification:', error);
    }
  }

  async getNotifications(
    email: string,
  ): Promise<PaginationNotificationResponse> {
    const limit = 10;
    const where = {
      toUser: email,
      attendedAt: IsNull(),
    };
    this.logger.debug('Get notification repository started');
    try {
      const notifications = await this.notificationsDB.find({
        where,
        order: {
          createdAt: 'DESC',
        },
        take: limit,
      });
      const count = await this.notificationsDB.count({
        where,
      });
      notifications.map(async (notification) => {
        if (!notification.notifiedAt) {
          await this.updateNotificationsDate(
            notification.id,
            DateToUpdateEnum.NOTIFIED_AT,
          );
        }
      });
      return new PaginationNotificationResponse(notifications, count);
    } catch (error) {
      this.logger.error(
        'Something went wrong while searching for the notifications:',
        error,
      );
    }
  }

  async updateNotificationsDate(
    id: string,
    dateToUpdate: DateToUpdateEnum,
  ): Promise<boolean> {
    try {
      let updateData: Partial<NotificationEntity> = {
        [dateToUpdate]: new Date(),
      };
      const notification = await this.notificationsDB.findOne({
        where: { id },
      });
      if (notification && this.isDateAlreadySet(notification, dateToUpdate)) {
        return false;
      }
      if (
        notification.notificationType &&
        dateToUpdate === DateToUpdateEnum.VIEWED_AT
      ) {
        updateData = { ...updateData, attendedAt: new Date() };
      }
      await this.notificationsDB.update(id, updateData);
      return true;
    } catch (error) {
      this.logger.error(
        'Something went wrong updating the notification:',
        error,
      );
    }
  }

  private isDateAlreadySet(
    notification: NotificationEntity,
    dateToUpdate: DateToUpdateEnum,
  ): boolean {
    switch (dateToUpdate) {
      case DateToUpdateEnum.NOTIFIED_AT:
        return !!notification.notifiedAt;
      case DateToUpdateEnum.VIEWED_AT:
        return !!notification.viewedAt;
      case DateToUpdateEnum.ATTENDED_AT:
        return !!notification.attendedAt;
      default:
        return false;
    }
  }

  async findNotification(
    adjustmentId: string,
    email: string,
  ): Promise<NotificationEntity> {
    const adjustment = await this.notificationsDB.find({
      where: { toUser: email, relatedId: adjustmentId },
    });
    return adjustment[0];
  }
}
