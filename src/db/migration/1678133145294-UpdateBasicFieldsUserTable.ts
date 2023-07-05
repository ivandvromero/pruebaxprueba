import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBasicFieldsUserTable1678133145294
  implements MigrationInterface
{
  name = 'UpdateBasicFieldsUserTable1678133145294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "phone_number_verified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "second_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "first_surname" character varying NOT NULL DEFAULT '*'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "second_surname" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "user_name" character varying NOT NULL DEFAULT '*'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone_prefix" character varying NOT NULL DEFAULT '*'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "external_id" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."external_id" IS 'Identificador unico del usuario en CRM'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "external_number" character varying NOT NULL DEFAULT '*'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."external_number" IS 'Numero del usuario en CRM'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "b_partner_id" character varying NOT NULL DEFAULT '*'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."b_partner_id" IS 'Identificador unico del usuario en PTS'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "enrollment_id" character varying NOT NULL DEFAULT '*'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."enrollment_id" IS 'Identificador unico del enrolamiento'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "first_name" SET DEFAULT '*'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phone_number" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number")`,
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
      `ALTER TABLE "deposits" ADD CONSTRAINT "UQ_f49ba0cd446eaf7abb4953385d9" UNIQUE ("id")`,
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
      `ALTER TABLE "deposits" DROP CONSTRAINT "UQ_f49ba0cd446eaf7abb4953385d9"`,
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
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phone_number" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "first_name" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "first_name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."enrollment_id" IS 'Identificador unico del enrolamiento'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "enrollment_id"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."b_partner_id" IS 'Identificador unico del usuario en PTS'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "b_partner_id"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."external_number" IS 'Numero del usuario en CRM'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "external_number"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."external_id" IS 'Identificador unico del usuario en CRM'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "external_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_prefix"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "second_surname"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_surname"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "second_name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone_number_verified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_name" character varying`,
    );
    await queryRunner.query(`DROP TABLE "favorites"`);
  }
}
