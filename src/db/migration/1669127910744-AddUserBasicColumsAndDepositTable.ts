import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserBasicColumsAndDepositTable1669127910744
  implements MigrationInterface
{
  name = 'AddUserBasicColumsAndDepositTable1669127910744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "statusConstraint"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "riskProfileConstraint"`,
    );
    await queryRunner.query(`CREATE TABLE "deposits" ("id" SERIAL NOT NULL, "account_number" character varying(15) NOT NULL, "status" integer NOT NULL DEFAULT '1', "update_at" TIMESTAMP DEFAULT now()::timestamp, "update_at_utc" TIMESTAMP DEFAULT (now() at time zone 'utc'), "userId" uuid, CONSTRAINT "UQ_f49ba0cd446eaf7abb4953385d9" UNIQUE ("id"), CONSTRAINT "UQ_054a6c24c403e4c29379cd62f63" UNIQUE ("account_number"), CONSTRAINT "CHK_75cc40ec3d2552eb1df348e1d2" CHECK (
    "status" = '1'  OR
    "status" = '2'  OR
    "status" = '3'
    ), CONSTRAINT "PK_f49ba0cd446eaf7abb4953385d9" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "document_type" integer NOT NULL DEFAULT '2'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "document_number" character varying(60) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "person_type" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "create_at" TIMESTAMP DEFAULT now()::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "create_at_utc" TIMESTAMP DEFAULT (now() at time zone 'utc')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "update_at" TIMESTAMP DEFAULT now()::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "update_at_utc" TIMESTAMP DEFAULT (now() at time zone 'utc')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433" UNIQUE ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_c9769cc4e9490d5bc9692c4857" CHECK (
  "person_type" = '1'  OR
  "person_type" = '2'
  )`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_a330afe5a1f76774f5f893efc4" CHECK (
  "document_type" = '1'  OR
  "document_type" = '2' OR
  "document_type" = '3' OR
  "document_type" = '4' OR
  "document_type" = '5' OR
  "document_type" = '6' OR
  "document_type" = '7' OR
  "document_type" = '8' OR
  "document_type" = '9' OR
  "document_type" = '10'
  )`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_eb6b056c0bff596dc578b0644f" CHECK (
  "risk_profile" = 'risk_profile_low' OR
  "risk_profile" = 'risk_profile_high' OR
  "risk_profile" = 'risk_profile_medium'
  )`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "CHK_c6ea8d711d5678ce73b0987b54" CHECK (
  "status" = 'NEWLY_REGISTERED' OR
  "status" = 'ACTIVE' OR
  "status" = 'INACTIVE' OR
  "status" = 'LOCKED'
  )`);
    await queryRunner.query(
      `ALTER TABLE "deposits" ADD CONSTRAINT "FK_968bcd26d29022f95d20bb70e21" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deposits" DROP CONSTRAINT "FK_968bcd26d29022f95d20bb70e21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "CHK_c6ea8d711d5678ce73b0987b54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "CHK_eb6b056c0bff596dc578b0644f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "CHK_a330afe5a1f76774f5f893efc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "CHK_c9769cc4e9490d5bc9692c4857"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "update_at_utc"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "update_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "create_at_utc"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "create_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "person_type"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "document_number"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "document_type"`);
    await queryRunner.query(`DROP TABLE "deposits"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "riskProfileConstraint" CHECK ((((risk_profile)::text = 'risk_profile_low'::text) OR ((risk_profile)::text = 'risk_profile_high'::text) OR ((risk_profile)::text = 'risk_profile_medium'::text)))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "statusConstraint" CHECK ((((status)::text = 'NEWLY_REGISTERED'::text) OR ((status)::text = 'ACTIVE'::text) OR ((status)::text = 'INACTIVE'::text)))`,
    );
  }
}
