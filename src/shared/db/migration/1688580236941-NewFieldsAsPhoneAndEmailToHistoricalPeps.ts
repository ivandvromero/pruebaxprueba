import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class NewFieldsAsPhoneAndEmailToHistoricalPeps1688580236941
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'historical_peps',
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        length: '50',
      }),
    );
    await queryRunner.addColumn(
      'historical_peps',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        length: '250',
      }),
    );
    await queryRunner.dropColumn('historical_peps', 'file');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('historical_peps', 'phone');
    await queryRunner.dropColumn('historical_peps', 'email');
    await queryRunner.dropColumn('historical_peps', 'file');
  }
}
