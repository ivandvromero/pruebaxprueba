import { SessionTimeEntity } from '@dale/session-time/repositories/session-time/session-time.entity';
import { TransactionCodesEntity } from '@dale/transaction-codes/repositories';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, unique: true })
  name: string;

  @ManyToMany(() => TransactionCodesEntity, (code) => code.roles)
  codes?: Promise<TransactionCodesEntity[]>;

  @OneToOne(() => SessionTimeEntity, (sessionTime) => sessionTime.id)
  @JoinColumn({ name: 'session_time' })
  sessionTime?: SessionTimeEntity;
}
