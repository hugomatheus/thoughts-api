import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConstraintNameTableUsers1740758075163
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE users
        ADD CONSTRAINT name_alphanumeric
        CHECK (name ~ '^[a-zA-Z0-9]+$')
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE users
        DROP CONSTRAINT name_alphanumeric
      `);
  }
}
