import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFavoriteTable1669328900890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'favorites',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'favorite_alias',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user-favorites');
  }
}
