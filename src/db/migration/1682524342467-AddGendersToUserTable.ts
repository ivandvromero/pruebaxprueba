import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGendersToUserTable1682524342467 implements MigrationInterface {
  name = 'AddGendersToUserTable1682524342467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "gender" integer`);
    await queryRunner.query(`ALTER TABLE "users" ADD "user_gender" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_gender"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
  }
}
