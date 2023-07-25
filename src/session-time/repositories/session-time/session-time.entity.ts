import { RoleEntity } from '@dale/roles/repositories/role/role.entity';
import { SessionTimeInterface } from '@dale/session-time/shared/interfaces/session-time.interface';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'session_time' })
export class SessionTimeEntity implements SessionTimeInterface {
  @PrimaryGeneratedColumn('uuid', { name: 'st_id' })
  id?: string;
  @Column('int', { name: 'st_session_time' })
  sessionTime: number;
  @OneToOne(() => RoleEntity, (role) => role.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'st_role_id' })
  role: RoleEntity;
}
