import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AdjustmentNewColumn1684939303823 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'monetary_adjustment_entity_orm',
      new TableColumn({
        name: 'assignedTo',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'monetary_adjustment_entity_orm',
      'assignedTo',
    );
  }
}
