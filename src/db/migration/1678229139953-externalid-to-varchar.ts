import { MigrationInterface, QueryRunner } from 'typeorm';

export class externalidToVarchar1678229139953 implements MigrationInterface {
  name = 'externalidToVarchar1678229139953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "external_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "external_id" character varying NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."external_id" IS 'Identificador unico del usuario en CRM'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."external_id" IS 'Identificador unico del usuario en CRM'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "external_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "external_id" integer NOT NULL DEFAULT '1'`,
    );
  }
}
