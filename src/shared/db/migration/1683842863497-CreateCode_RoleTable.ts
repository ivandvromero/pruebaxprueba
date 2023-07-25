import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCodeRoleTable1683842863497 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'code_role',
        columns: [
          {
            name: 'code_id',
            type: 'integer',
          },
          {
            name: 'role_id',
            type: 'integer',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('code_role');
  }
}
