import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTypeFieldToTransactionCodesEntity1686157455767
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'codes',
      new TableColumn({
        name: 'type',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('codes', 'type');
  }
}
