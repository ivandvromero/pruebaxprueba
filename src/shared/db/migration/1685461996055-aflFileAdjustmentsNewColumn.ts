import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MassiveMonetaryAdjustmentFileNewColumn1685461996055
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'file_massive_monetary_adjustment',
      new TableColumn({
        name: 'assigned_to',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'file_massive_monetary_adjustment',
      'assigned_to',
    );
  }
}
