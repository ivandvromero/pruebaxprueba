import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsCrm1680712986355 implements MigrationInterface {
  name = 'AddColumnsCrm1680712986355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "agreement_id" character varying(10) NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "accounts"."agreement_id" IS 'Identificador del convenio que se administra por dale!, Por defecto se deja 1 que equivale a convenio dale!'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "crm_deposit_id" character varying(30)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "accounts"."crm_deposit_id" IS 'Identificador de depósito en CRM'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "crm_contact_agreement_id" character varying(30)`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "accounts"."crm_contact_agreement_id" IS 'Identificador de Convenio, del contacto en CRM'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "UQ_5a7a02c20412299d198e097a8fe" UNIQUE ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "update_at" SET DEFAULT now()::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "update_at_utc" SET DEFAULT (now() at time zone 'utc')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "update_at_utc" SET DEFAULT (now() AT TIME ZONE 'utc')`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "update_at" SET DEFAULT (now())`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "UQ_5a7a02c20412299d198e097a8fe"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "accounts"."crm_contact_agreement_id" IS 'Identificador de Convenio, del contacto en CRM'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP COLUMN "crm_contact_agreement_id"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "accounts"."crm_deposit_id" IS 'Identificador de depósito en CRM'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP COLUMN "crm_deposit_id"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "accounts"."agreement_id" IS 'Identificador del convenio que se administra por dale!, Por defecto se deja 1 que equivale a convenio dale!'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP COLUMN "agreement_id"`,
    );
  }
}
