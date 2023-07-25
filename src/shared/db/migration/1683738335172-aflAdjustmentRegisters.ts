import { MigrationInterface, QueryRunner } from 'typeorm';

export class AflAdjustmentRegisters1683738335172 implements MigrationInterface {
  name = 'AflAdjustmentRegisters1683738335172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "update_adjustment_register" ("monetary_adjustments_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user" text NOT NULL, "updatedAt" text NOT NULL, CONSTRAINT "PK_b4ffd942b6b469332502d2a42d1" PRIMARY KEY ("monetary_adjustments_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ADD "updateRegisterId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "amount" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "fees" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "vat" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "gmf" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "created_at_monetary_adjustment" SET DEFAULT '"2023-05-10T17:05:37.787Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_massive_monetary_adjustment" ALTER COLUMN "created_at_massive_file" SET DEFAULT '"2023-05-10T17:05:37.788Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ADD CONSTRAINT "FK_4e8dddd0910da4116e708c728cc" FOREIGN KEY ("updateRegisterId") REFERENCES "update_adjustment_register"("monetary_adjustments_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" DROP CONSTRAINT "FK_4e8dddd0910da4116e708c728cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_massive_monetary_adjustment" ALTER COLUMN "created_at_massive_file" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "created_at_monetary_adjustment" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "gmf" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "vat" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "fees" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ALTER COLUMN "amount" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" DROP COLUMN "updateRegisterId"`,
    );
    await queryRunner.query(`DROP TABLE "update_adjustment_register"`);
  }
}
