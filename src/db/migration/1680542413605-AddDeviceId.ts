import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeviceId1680542413605 implements MigrationInterface {
  name = 'AddDeviceId1680542413605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "device_id" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."device_id" IS 'Identificador unico del dispositivo seguro'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "users"."device_id" IS 'Identificador unico del dispositivo seguro'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "device_id"`);
  }
}
