import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCityAddDepartament1686751193675 implements MigrationInterface {
  name = 'AddCityAddDepartament1686751193675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "department" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."department" IS 'Departamento de residencia'`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "city" character varying`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."city" IS 'Ciudad de residencia'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."city" IS 'Ciudad de residencia'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "city"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."department" IS 'Departamento de residencia'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "department"`);
  }
}
