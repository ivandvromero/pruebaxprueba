import {
  Column,
  Entity,
  Check,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'accounts' })
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
export class Account {
  @PrimaryColumn()
  @Column({ primary: true, unique: true, type: 'uuid' })
  id: string;

  @Column({ name: 'account_number', length: 15, unique: true, nullable: false })
  accountNumber: string;

  @Column({ name: 'user_id', type: 'uuid', unique: false, nullable: false })
  userId: string;

  @Column({
    name: 'agreement_id',
    length: 10,
    unique: false,
    nullable: false,
    default: '1',
    comment:
      'Identificador del convenio que se administra por dale!, Por defecto se deja 1 que equivale a convenio dale!',
  })
  agreementId?: string;

  @Column({
    name: 'crm_deposit_id',
    length: 30,
    unique: false,
    nullable: true,
    comment: 'Identificador de depósito en CRM',
  })
  crmDepositId?: string;

  @Column({
    name: 'crm_contact_agreement_id',
    length: 30,
    unique: false,
    nullable: true,
    comment: 'Identificador de Convenio, del contacto en CRM',
  })
  crmContactAgreementId?: string;

  @Column({ name: 'status', type: 'int', nullable: false, default: '1' })
  status?: number;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    nullable: true,
    default: () => 'now()::timestamp',
  })
  updateAt?: string;

  @UpdateDateColumn({
    name: 'update_at_utc',
    type: 'timestamp',
    nullable: true,
    default: () => "(now() at time zone 'utc')",
  })
  updateAtUTC?: Date;
}
