import {
  Column,
  Entity,
  PrimaryColumn,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Deposit } from '../deposit/deposit.entity';
import { Favorite } from '../favorite/favorite.entity';

export class AddressDetails {
  buildingNumber?: string;

  street?: string;

  town: string;

  postCode: string;

  country: string;
}

@Entity({ name: 'users' })
@Check(
  `
  "status" = 'NEWLY_REGISTERED' OR
  "status" = 'ACTIVE' OR
  "status" = 'INACTIVE' OR
  "status" = 'LOCKED'
  `,
)
@Check(
  `
  "risk_profile" = 'risk_profile_low' OR
  "risk_profile" = 'risk_profile_high' OR
  "risk_profile" = 'risk_profile_medium'
  `,
)
//DocumentTypes
// 1 => Tarjeta de Identidad
// 2 => Cédula de ciudadanía
// 3 => Cédula de extranjería
// 4 => Registro Civil
// 5 => NIT
// 6 => Pasaporte
// 7 => Tarjeta de seguro social extranjero
// 8 => Sociedad extranjera sin NIT en colombia
// 9 => Fideicomiso
// 10 => Carnet diplomático
@Check(
  `
  "document_type" = '1'  OR
  "document_type" = '2' OR
  "document_type" = '3' OR
  "document_type" = '4' OR
  "document_type" = '5' OR
  "document_type" = '6' OR
  "document_type" = '7' OR
  "document_type" = '8' OR
  "document_type" = '9' OR
  "document_type" = '10'
  `,
)
//DocumentTypes
// 1 => Personal Natural
// 2 => Persona Juridica
@Check(
  `
  "person_type" = '1'  OR
  "person_type" = '2'
  `,
)
export class User {
  @PrimaryColumn()
  @Column({ primary: true, unique: true, type: 'uuid' })
  id: string;

  @Column({ nullable: true, unique: false })
  email?: string;

  @Column({ name: 'first_name', nullable: false, default: '*' })
  firstName: string;

  @Column({ name: 'second_name', nullable: true })
  secondName?: string;

  @Column({ name: 'first_surname', nullable: false, default: '*' })
  firstSurname: string;

  @Column({ name: 'second_surname', nullable: true })
  secondSurname?: string;

  @Column({ name: 'gender', nullable: true })
  gender: number;

  @Column({ name: 'user_gender', nullable: true })
  userGender?: number;

  @Column({ name: 'document_type', type: 'int', nullable: false, default: '2' })
  documentType: string;

  @Column({
    name: 'document_number',
    type: 'varchar',
    length: 60,
    nullable: false,
    default: '',
  })
  documentNumber: string;

  @Column({ name: 'phone_number', unique: true, nullable: false })
  phoneNumber: string;

  @Column({ name: 'user_name', unique: false, nullable: false, default: '*' })
  username: string;

  @Column({ name: 'phone_prefix', nullable: false, default: '*' })
  phonePrefix?: string;

  @Column({ nullable: true, type: 'date' })
  dob?: Date;

  @Column('json', { nullable: true })
  address?: AddressDetails;

  @Column({ default: 'NEWLY_REGISTERED' })
  status?: string;

  @Column({ name: 'risk_profile', nullable: true })
  riskProfile?: string;

  @Column({ name: 'person_type', type: 'int', nullable: false, default: '1' })
  personType?: number;
  @Column({
    name: 'department',
    type: 'varchar',
    nullable: true,
    comment: 'Departamento de residencia',
  })
  department?: string;
  @Column({
    name: 'city',
    type: 'varchar',
    nullable: true,
    comment: 'Ciudad de residencia',
  })
  city?: string;

  @Column({ name: 'full_migration_dale1', nullable: true })
  full_migration_dale1?: boolean;

  @Column({
    name: 'external_id',
    type: 'varchar',
    nullable: true,
    comment: 'Identificador unico del usuario en CRM',
  })
  externalId?: string;

  @Column({
    name: 'external_number',
    nullable: true,
    comment: 'Numero del usuario en CRM',
  })
  externalNumber?: string;

  @Column({
    name: 'b_partner_id',
    nullable: true,
    comment: 'Identificador unico del usuario en PTS',
  })
  bPartnerId?: string;

  @Column({
    name: 'enrollment_id',
    nullable: false,
    comment: 'Identificador unico del enrolamiento',
    default: '*',
  })
  enrollmentId: string;

  @Column({
    name: 'device_id',
    nullable: true,
    comment: 'Identificador unico del dispositivo seguro',
  })
  deviceId?: string;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    nullable: true,
    default: () => 'now()::timestamp',
  })
  createAt?: string;

  @CreateDateColumn({
    name: 'create_at_utc',
    type: 'timestamp',
    nullable: true,
    default: () => "(now() at time zone 'utc')",
  })
  createAtUTC?: Date;

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

  @OneToMany(() => Deposit, (deposit) => deposit.user)
  deposits?: Deposit[];
  @OneToMany(() => Favorite, (favorite) => favorite.userId)
  favorites?: Favorite[];
}
