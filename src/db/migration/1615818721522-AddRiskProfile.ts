import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableCheck,
} from 'typeorm';

export const riskProfileCheck = new TableCheck({
  name: 'riskProfileConstraint',
  expression: `
  "risk_profile" = 'risk_profile_low' OR 
  "risk_profile" = 'risk_profile_high' OR 
  "risk_profile" = 'risk_profile_medium'
  `,
});

export class AddRiskProfile1615818721522 implements MigrationInterface {
  name = 'AddRiskProfile1615818721522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'risk_profile',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
    await queryRunner.createCheckConstraint('users', riskProfileCheck);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropCheckConstraint('users', riskProfileCheck);
    await queryRunner.dropColumns('users', [
      new TableColumn({
        name: 'risk_profile',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }
}
