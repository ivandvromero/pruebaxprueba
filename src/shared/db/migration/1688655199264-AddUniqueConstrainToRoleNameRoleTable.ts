import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AddUniqueConstrainToRoleNameRoleTable1688655199264
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'roles',
      new TableUnique({
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('roles', 'name');
  }
}
