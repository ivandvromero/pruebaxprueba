import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PepStatus } from '../shared/enums/pep-status.enum';

@Entity('historical_peps')
export class HistoricalEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  date: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  answerDate?: Date;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  identification: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'PENDING',
  })
  status?: PepStatus = PepStatus.PENDING;

  @Column({
    type: 'integer',
    default: 1,
    nullable: true,
  })
  statusLevel: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 250,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  comment: string;

  @Column({
    type: 'varchar',
    length: 250,
  })
  validatorEmail?: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  approverEmail?: string;
}
