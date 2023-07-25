import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSessionTimeTable1688487711327 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'session_time',
        columns: [
          {
            name: 'st_id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true,
          },
          {
            name: 'st_role_id',
            type: 'integer',
            isUnique: true,
          },
          {
            name: 'st_session_time',
            type: 'integer',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('session_time');
  }
}
