import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInputsOptional1678712917361 implements MigrationInterface {
  name = 'AddInputsOptional1678712917361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "UQ_890818d27523748dd36a4d1bdc8" UNIQUE ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "external_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "external_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "external_number" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "external_number" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "b_partner_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "b_partner_id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "create_at" SET DEFAULT now()::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "create_at_utc" SET DEFAULT (now() at time zone 'utc')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "update_at" SET DEFAULT now()::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "update_at_utc" SET DEFAULT (now() at time zone 'utc')`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposits" ALTER COLUMN "update_at" SET DEFAULT now()::timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposits" ALTER COLUMN "update_at_utc" SET DEFAULT (now() at time zone 'utc')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deposits" ALTER COLUMN "update_at_utc" SET DEFAULT (now() AT TIME ZONE 'utc')`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposits" ALTER COLUMN "update_at" SET DEFAULT (now())`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "update_at_utc" SET DEFAULT (now() AT TIME ZONE 'utc')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "update_at" SET DEFAULT (now())`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "create_at_utc" SET DEFAULT (now() AT TIME ZONE 'utc')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "create_at" SET DEFAULT (now())`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "b_partner_id" SET DEFAULT '*'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "b_partner_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "external_number" SET DEFAULT '*'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "external_number" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "external_id" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "external_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "UQ_890818d27523748dd36a4d1bdc8"`,
    );
  }
}
