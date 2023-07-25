import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddActiveFieldsToTransactionCodesEntity1686157152058
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'codes',
      new TableColumn({
        name: 'activeFields',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('codes', 'activeFields');
  }
}
