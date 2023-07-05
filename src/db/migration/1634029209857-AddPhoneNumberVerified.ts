import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhoneNumberVerified1634029209857 implements MigrationInterface {
  name = 'AddPhoneNumberVerified1634029209857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'phone_number_verified',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'phone_number_verified');
  }
}
