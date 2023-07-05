import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEmailToOptional1678284866445 implements MigrationInterface {
  name = 'ChangeEmailToOptional1678284866445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`,
    );
  }
}
