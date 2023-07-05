import {
  Column,
  Entity,
  Check,
  ManyToOne,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'deposits' })
//Status
// 1 => Activo
// 2 => Cancelado
// 3 => Bloqueado
@Check(
  `
    "status" = '1'  OR
    "status" = '2'  OR
    "status" = '3'
    `,
)
export class Deposit {
  @PrimaryGeneratedColumn()
  @Column({ primary: true, unique: true })
  id: number;

  @Column({ name: 'account_number', length: 15, unique: true, nullable: false })
  accountNumber: string;

  @Column({ name: 'status', type: 'int', nullable: false, default: '1' })
  status?: number;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    nullable: true,
    default: () => 'now()::timestamp',
  })
  updateAt?: Date;

  @UpdateDateColumn({
    name: 'update_at_utc',
    type: 'timestamp',
    nullable: true,
    default: () => "(now() at time zone 'utc')",
  })
  updateAtUTC?: Date;

  @ManyToOne(() => User, (user) => user.deposits)
  user: User;
}
