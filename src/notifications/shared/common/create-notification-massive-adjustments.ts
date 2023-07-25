import { CreateNotificationDto } from '@dale/notifications/dto/create-notification.dto';
import { NotificationRelatedType } from '../enums/notification-related-type.enum';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { AdjustmentState } from '@dale/monetary-adjustment/shared/enums';
import { NotificationTitleCapturer } from '../enums/notification-title-capturer.enum';
import { userLevel } from '@dale/monetary-adjustment/shared/common';
import { FileMassiveMonetaryAdjustment } from '@dale/monetary-adjustment/repositories/file-monetary-adjustment/massive-monetary-adjustment-file.entity';
import { titleMassiveAdjustmentsLevel } from './notification-title-massive-adjustments';

export class CreateNotificationMassiveAdjustment
  implements CreateNotificationDto
{
  toUser: string;
  relatedId: string;
  relatedType: string;
  title: string;
  description: string;
  notificationType: boolean;

  constructor(
    file: FileMassiveMonetaryAdjustment,
    adjustmentMetadata: UserInfoInterface,
    state?: string,
    capturer?: string,
  ) {
    const { assignedTo, id, formattedName } = file;
    const { role } = adjustmentMetadata;

    this.toUser = capturer ? capturer : assignedTo;
    this.relatedId = id;
    this.relatedType = NotificationRelatedType.MASSIVE_ADJUSTMENTS;
    if (state === AdjustmentState.REJECTED) {
      this.title = NotificationTitleCapturer.MASSIVE_ADJUSTMENTS_REJECTED;
    } else if (state === AdjustmentState.ACCEPTED) {
      this.title = NotificationTitleCapturer.MASSIVE_ADJUSTMENTS_APPROVED;
    } else if (state === AdjustmentState.ACCEPTED_WITH_ERROR) {
      this.title =
        NotificationTitleCapturer.MASSIVE_ADJUSTMENTS_APPROVED_WITH_ERRORS;
    } else if (state === AdjustmentState.FAILED) {
      this.title = NotificationTitleCapturer.MASSIVE_ADJUSTMENTS_FAILED;
    } else {
      this.title = titleMassiveAdjustmentsLevel[userLevel[role]];
    }
    this.description = `Nombre del archivo: ${formattedName}`;
    this.notificationType = capturer ? true : false;
  }
}
