import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateDOB1620733063911 implements MigrationInterface {
  name = 'UpdateDOB1620733063911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'dob',
      new TableColumn({
        name: 'dob',
        type: 'date',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'dob',
      new TableColumn({
        name: 'dob',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }
}
