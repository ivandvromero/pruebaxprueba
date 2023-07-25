import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSessionTimeColumnRoleTable1688654603330
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'roles',
      new TableColumn({
        name: 'session_time',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('roles', 'session_time');
  }
}