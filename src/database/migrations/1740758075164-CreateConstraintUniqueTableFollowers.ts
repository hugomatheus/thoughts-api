import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConstraintUniqueTableFollowers1740758075164
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE followers
        ADD CONSTRAINT unique_follower_following
        UNIQUE (follower_id, following_id)
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE users
        DROP CONSTRAINT unique_follower_following
      `);
  }
}
