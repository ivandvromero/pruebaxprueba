import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNotificationsTable1685999221761
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'ntf_id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true,
          },
          {
            name: 'ntf_to_user',
            type: 'text',
          },
          {
            name: 'ntf_related_id',
            type: 'uuid',
          },
          {
            name: 'ntf_related_type',
            type: 'text',
          },
          {
            name: 'ntf_title',
            type: 'text',
          },
          {
            name: 'ntf_description',
            type: 'text',
          },
          {
            name: 'ntf_notification_type',
            type: 'bool',
          },
          {
            name: 'ntf_created_at',
            type: 'timestamp',
          },
          {
            name: 'ntf_notified_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'ntf_viewed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'ntf_attended_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
  }
}
