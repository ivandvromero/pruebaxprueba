import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdjustmentState } from '../../shared/enums/adjustment-state.enum';
import { MassiveMonetaryAdjustmentFileInterface } from '../../shared/interfaces/massive-monetary-adjustment-file.interface';
import { MonetaryAdjustmentEntityOrm } from '../monetary-adjustment/monetary-adjustment.entity';

@Entity()
export class FileMassiveMonetaryAdjustment
  implements MassiveMonetaryAdjustmentFileInterface
{
  @PrimaryGeneratedColumn('uuid', { name: 'monetary_adjustment_file_id' })
  id?: string;
  @Column('text', {
    nullable: true,
    default: 'PENDING',
  })
  adjustmentState?: AdjustmentState;
  @Column('text', {
    nullable: true,
    default: null,
  })
  comment?: string;
  @Column({
    name: 'created_at_massive_file',
    default: new Date(),
  })
  createdAt?: Date;
  @Column('text')
  fileName: string;
  @Column('text')
  formattedName: string;

  @Index({ unique: true })
  @Column('text')
  frontId: string;

  @Column('boolean', {
    default: false,
  })
  hasError?: boolean;
  @Column('text')
  size: number;
  @Column('numeric', {
    nullable: true,
    default: 0,
  })
  totalCredit: number;
  @Column('numeric', {
    nullable: true,
    default: 0,
  })
  totalDebit: number;
  @Column('numeric', {
    nullable: true,
    default: 0,
  })
  totalRecords: number;
  @Column('integer', {
    default: 1,
    nullable: true,
  })
  transactionLevel: number;
  @Column('timestamp without time zone', {
    nullable: true,
  })
  updatedAt?: Date;

  @Column('simple-array')
  usersEmails: string[];

  @Column('text', {
    name: 'assigned_to',
    nullable: true,
  })
  assignedTo?: string | null;

  @OneToMany(
    () => MonetaryAdjustmentEntityOrm,
    (adjustment) => adjustment.file,
    {
      cascade: true,
    },
  )
  adjustments: MonetaryAdjustmentEntityOrm[];
}
