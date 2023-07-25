import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTransactionCodesTable1683838704544
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'codes',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '25',
          },
          {
            name: 'description',
            type: 'text',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('codes');
  }
}
