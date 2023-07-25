import { NotificationInterface } from '@dale/notifications/shared/interfaces/notification.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notifications' })
export class NotificationEntity implements NotificationInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'ntf_id' })
  id: string;
  @Column('text', { name: 'ntf_to_user' })
  toUser: string;
  @Column('uuid', { name: 'ntf_related_id' })
  relatedId: string;
  @Column('text', { name: 'ntf_related_type' })
  relatedType: string;
  @Column('text', { name: 'ntf_title' })
  title: string;
  @Column('text', { name: 'ntf_description' })
  description: string;
  @Column('bool', { name: 'ntf_notification_type' })
  notificationType: boolean;
  @Column('timestamp', {
    name: 'ntf_created_at',
  })
  createdAt: Date;
  @Column('timestamp', {
    name: 'ntf_notified_at',
    nullable: true,
  })
  notifiedAt?: Date;
  @Column('timestamp', {
    name: 'ntf_viewed_at',
    nullable: true,
  })
  viewedAt?: Date;
  @Column('timestamp', {
    name: 'ntf_attended_at',
    nullable: true,
  })
  attendedAt?: Date;
}
