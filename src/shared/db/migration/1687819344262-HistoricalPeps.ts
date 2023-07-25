import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class HistoricalPeps1687810382203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'historical_peps',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'date',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'answerDate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'identification',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'statusLevel',
            type: 'integer',
            default: 1,
            isNullable: true,
          },
          {
            name: 'file',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'comment',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'validatorEmail',
            type: 'varchar',
            length: '250',
          },
          {
            name: 'approverEmail',
            type: 'varchar',
            length: '250',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('historical_peps');
  }
}
