import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseStructure1681754419062 implements MigrationInterface {
  name = 'BaseStructure1681754419062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "monetary_adjustment_entity_orm" ("monetary_adjustments_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dateFile" text, "clientId" text, "depositNumber" text NOT NULL, "amount" numeric NOT NULL, "adjustmentType" text NOT NULL, "adjustmentState" text DEFAULT 'PENDING', "transactionLevel" integer DEFAULT '1', "transactionCode" text NOT NULL, "transactionDescription" text NOT NULL, "fees" numeric DEFAULT '0', "vat" numeric DEFAULT '0', "gmf" numeric DEFAULT '0', "created_at_monetary_adjustment" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, "comment" text, "isFromFile" boolean NOT NULL DEFAULT false, "adjustmentReason" text NOT NULL, "responsible" text, "transactionName" text, "fileId" uuid, CONSTRAINT "PK_470fb0805a98d29907afba4f592" PRIMARY KEY ("monetary_adjustments_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file_massive_monetary_adjustment" ("monetary_adjustment_file_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adjustmentState" text DEFAULT 'PENDING', "comment" text, "created_at_massive_file" TIMESTAMP NOT NULL DEFAULT now(), "fileName" text NOT NULL, "formattedName" text NOT NULL, "frontId" text NOT NULL, "hasError" boolean NOT NULL DEFAULT false, "size" text NOT NULL, "totalCredit" numeric DEFAULT '0', "totalDebit" numeric DEFAULT '0', "totalRecords" numeric DEFAULT '0', "transactionLevel" integer DEFAULT '1', "updatedAt" TIMESTAMP, "usersEmails" text NOT NULL, CONSTRAINT "PK_c1c0b1fa0917978939c34024062" PRIMARY KEY ("monetary_adjustment_file_id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_92c54e18f930f8a1784e3af2bf" ON "file_massive_monetary_adjustment" ("frontId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" ADD CONSTRAINT "FK_f4d81d4c04123fea262075d843d" FOREIGN KEY ("fileId") REFERENCES "file_massive_monetary_adjustment"("monetary_adjustment_file_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "monetary_adjustment_entity_orm" DROP CONSTRAINT "FK_f4d81d4c04123fea262075d843d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_92c54e18f930f8a1784e3af2bf"`,
    );
    await queryRunner.query(`DROP TABLE "file_massive_monetary_adjustment"`);
    await queryRunner.query(`DROP TABLE "monetary_adjustment_entity_orm"`);
  }
}
