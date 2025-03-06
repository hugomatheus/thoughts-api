import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTableThoughtsSentiments1740748738946
  implements MigrationInterface
{
  private readonly table = new Table({
    name: 'thoughts_sentiments',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      },
      {
        name: 'thought_id',
        type: 'uuid',
      },
      {
        name: 'type',
        type: 'enum',
        enum: ['positive', 'negative', 'neutral'],
      },
    ],
  });

  private readonly thoughtForeignKey = new TableForeignKey({
    columnNames: ['thought_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'thoughts',
    onDelete: 'CASCADE',
  });

  private readonly typeIndex = new TableIndex({
    columnNames: ['type'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKeys(this.table, [this.thoughtForeignKey]);
    await queryRunner.createIndex(this.table, this.typeIndex);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(this.table, this.typeIndex);
    await queryRunner.dropForeignKeys(this.table, [this.thoughtForeignKey]);
    await queryRunner.dropTable(this.table);
  }
}
