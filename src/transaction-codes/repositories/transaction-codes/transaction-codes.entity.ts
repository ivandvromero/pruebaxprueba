import { RoleEntity } from '@dale/roles/repositories';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'codes' })
export class TransactionCodesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 25,
    type: 'varchar',
    unique: true,
  })
  code: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  activeFields: string;

  @JoinTable({
    name: 'code_role',
    joinColumn: {
      name: 'code_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => RoleEntity, (role) => role.codes)
  roles?: RoleEntity[] | string[];
}
