import { MonetaryAdjustmentEntityOrm } from '@dale/monetary-adjustment/repositories/activity-update/update-adjustment-register.entity';
import { CreateNotificationDto } from '@dale/notifications/dto/create-notification.dto';
import { NotificationRelatedType } from '../enums/notification-related-type.enum';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { AdjustmentState } from '@dale/monetary-adjustment/shared/enums';
import { NotificationTitleCapturer } from '../enums/notification-title-capturer.enum';
import { userLevel } from '@dale/monetary-adjustment/shared/common';
import { titleSingleAdjustmentLevel } from './notification-title-single-adjustment';

export class CreateNotificationSingleAdjustment
  implements CreateNotificationDto
{
  toUser: string;
  relatedId: string;
  relatedType: string;
  title: string;
  description: string;
  notificationType: boolean;

  constructor(
    monetaryAdjustment: MonetaryAdjustmentEntityOrm,
    adjustmentMetadata: UserInfoInterface,
    state?: string,
    capturer?: string,
  ) {
    const { assignedTo, id, depositNumber } = monetaryAdjustment;
    const { role } = adjustmentMetadata;

    this.toUser = capturer ? capturer : assignedTo;
    this.relatedId = id;
    this.relatedType = NotificationRelatedType.SINGLE_ADJUSTMENT;
    if (state === AdjustmentState.REJECTED) {
      this.title = NotificationTitleCapturer.SINGLE_ADJUSTMENT_REJECTED;
    } else if (state) {
      this.title = NotificationTitleCapturer.SINGLE_ADJUSTMENT_APPROVED;
    } else {
      this.title = titleSingleAdjustmentLevel[userLevel[role]];
    }
    this.description = `No. depósito electrónico: ${depositNumber}`;
    this.notificationType = capturer ? true : false;
  }
}
