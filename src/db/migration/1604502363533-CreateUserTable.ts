import { MigrationInterface, QueryRunner, Table, TableCheck } from 'typeorm';

export const check = new TableCheck({
  name: 'statusConstraint',
  expression: `
  "status" = 'NEWLY_REGISTERED' OR 
  "status" = 'ACTIVE' OR 
  "status" = 'INACTIVE'
  `,
});

export class CreateUserTable1603708463451 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'dob',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'NEWLY_REGISTERED'",
          },
        ],
      }),
      true,
    );
    await queryRunner.createCheckConstraint('users', check);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropCheckConstraint('users', check);
    await queryRunner.dropTable('users');
  }
}
