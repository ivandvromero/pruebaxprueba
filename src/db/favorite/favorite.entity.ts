import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryColumn()
  @Column({ primary: true, unique: true, type: 'uuid' })
  id: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({
    name: 'favorite_alias',
    nullable: false,
    type: 'varchar',
    length: 50,
  })
  favoriteAlias: string;

  @Column({
    name: 'phone_number',
    nullable: false,
    type: 'varchar',
    length: 10,
  })
  phoneNumber: string;
}
