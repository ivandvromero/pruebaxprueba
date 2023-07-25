import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AdjustmentRegisterNewColumn1685452913098
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'update_adjustment_register',
      new TableColumn({
        name: 'user_email',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('update_adjustment_register', 'user_email');
  }
}
