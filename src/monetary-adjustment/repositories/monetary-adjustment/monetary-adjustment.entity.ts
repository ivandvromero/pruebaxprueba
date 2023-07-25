import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionType } from '../../shared/enums/adjustment-type.enum';
import { AdjustmentState } from '../../shared/enums/adjustment-state.enum';
import { MonetaryAdjustmentInterface } from '../../shared/interfaces/monetary-adjustment.interface';
import { AdjustmentReason } from '../../shared/enums/adjustment-reason.enum';
import { ColumnNumericTransformer } from '../../shared/common/column-numeric-transform';
import { FileMassiveMonetaryAdjustment } from '../file-monetary-adjustment/massive-monetary-adjustment-file.entity';
import { UpdateAdjustmentRegister } from '../activity-update/update-adjustment-register.entity';

@Entity()
export class MonetaryAdjustmentEntityOrm
  implements MonetaryAdjustmentInterface
{
  @PrimaryGeneratedColumn('uuid', { name: 'monetary_adjustments_id' })
  id?: string;

  @Column('text', {
    nullable: true,
  })
  dateFile?: string;

  @Column('text', {
    nullable: true,
  })
  clientId?: string;

  @Column('text')
  depositNumber: string;

  @Column('numeric', {
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column('text')
  adjustmentType: TransactionType;

  @Column('text', {
    nullable: true,
    default: 'PENDING',
  })
  adjustmentState?: AdjustmentState;

  @Column('integer', {
    default: 1,
    nullable: true,
  })
  transactionLevel?: number;

  @Column('text')
  transactionCode: string;

  @Column('text')
  transactionDescription: string;

  @Column('numeric', {
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
    default: 0,
  })
  fees: number; //commission

  @Column('numeric', {
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
    default: 0,
  })
  vat: number; //iva

  @Column('numeric', {
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
    default: 0,
  })
  gmf: number;

  @Column({
    name: 'created_at_monetary_adjustment',
    default: new Date(),
  })
  createdAt?: Date;

  @Column('timestamp without time zone', {
    nullable: true,
  })
  updatedAt?: Date;

  @Column('text', {
    nullable: true,
    default: null,
  })
  comment?: string | null;

  @Column('boolean', {
    default: false,
  })
  isFromFile?: boolean;

  @Column('text')
  adjustmentReason: AdjustmentReason;

  @Column('text', {
    nullable: true,
  })
  responsible?: string | null;
  @Column('text', {
    nullable: true,
  })
  transactionName?: string | null;

  @Column('text', {
    nullable: true,
  })
  assignedTo?: string | null;

  @ManyToOne(() => FileMassiveMonetaryAdjustment, (file) => file.adjustments, {
    onDelete: 'CASCADE',
  })
  file?: FileMassiveMonetaryAdjustment;

  @ManyToOne(
    () => UpdateAdjustmentRegister,
    (register) => register.adjustment,
    {
      onDelete: 'CASCADE',
    },
  )
  updateRegister?: UpdateAdjustmentRegister;
}

export { FileMassiveMonetaryAdjustment };
