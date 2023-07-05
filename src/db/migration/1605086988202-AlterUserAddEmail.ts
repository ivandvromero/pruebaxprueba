import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUserAddEmail1605086988202 implements MigrationInterface {
  name = 'AlterUserAddEmail1605086988202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'email');
  }
}
