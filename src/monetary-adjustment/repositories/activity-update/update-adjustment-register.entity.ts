import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateAdjustmentRegisterInterface } from 'src/monetary-adjustment/shared/interfaces/update-adjustment-register.interface';
import { MonetaryAdjustmentEntityOrm } from '../monetary-adjustment/monetary-adjustment.entity';

@Entity()
export class UpdateAdjustmentRegister
  implements UpdateAdjustmentRegisterInterface
{
  @PrimaryGeneratedColumn('uuid', {
    name: 'monetary_adjustments_id',
  })
  id?: string;

  @Column('simple-array')
  user: string[];

  @Column('simple-array', { name: 'user_email', nullable: true })
  userEmail: string[];
  @Column('simple-array')
  updatedAt: Date[];

  @OneToMany(
    () => MonetaryAdjustmentEntityOrm,
    (adjustment) => adjustment.updateRegister,
  )
  adjustment?: MonetaryAdjustmentEntityOrm;
}

export { MonetaryAdjustmentEntityOrm };
