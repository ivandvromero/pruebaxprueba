import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AddUniqueConstrainToCodeInCodesTable1688656336726
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'codes',
      new TableUnique({
        columnNames: ['code'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('codes', 'code');
  }
}
