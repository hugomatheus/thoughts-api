import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableFollowers1740747748594 implements MigrationInterface {
  private readonly table = new Table({
    name: 'followers',
    columns: [
      {
        name: 'follower_id',
        type: 'uuid',
        isPrimary: true,
      },
      {
        name: 'following_id',
        type: 'uuid',
        isPrimary: true,
      },
    ],
  });

  private readonly followerForeignKey = new TableForeignKey({
    columnNames: ['follower_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'users',
    onDelete: 'CASCADE',
  });

  private readonly followingForeignKey = new TableForeignKey({
    columnNames: ['following_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'users',
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKeys(this.table, [
      this.followerForeignKey,
      this.followingForeignKey,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(this.table, [
      this.followerForeignKey,
      this.followingForeignKey,
    ]);
    await queryRunner.dropTable(this.table);
  }
}
