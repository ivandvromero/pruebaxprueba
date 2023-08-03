import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountsTable1677783027521 implements MigrationInterface {
  name = 'CreateAccountsTable1677783027521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL, "account_number" character varying(15) NOT NULL, "user_id" uuid NOT NULL, "status" integer NOT NULL DEFAULT '1', "update_at" TIMESTAMP DEFAULT now()::timestamp, "update_at_utc" TIMESTAMP DEFAULT (now() at time zone 'utc'), CONSTRAINT "UQ_5a7a02c20412299d198e097a8fe" UNIQUE ("id"), CONSTRAINT "UQ_ffd1ae96513bfb2c6eada0f7d31" UNIQUE ("account_number"), CONSTRAINT "CHK_2ccdc546706d2eb4f5ac72ddef" CHECK (
      "status" = '1'  OR
      "status" = '2'  OR
      "status" = '3'
      ), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "accounts"`);
  }
}
