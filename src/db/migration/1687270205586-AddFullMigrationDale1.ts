import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFullMigrationDale11687270205586 implements MigrationInterface {
  name = 'AddFullMigrationDale11687270205586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "full_migration_dale1" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "full_migration_dale1"`,
    );
  }
}
