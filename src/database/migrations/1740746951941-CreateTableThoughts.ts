import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableThoughts1740746951941 implements MigrationInterface {
  private readonly table = new Table({
    name: 'thoughts',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      },
      {
        name: 'user_id',
        type: 'uuid',
      },
      {
        name: 'reference_thought_id',
        type: 'uuid',
        isNullable: true,
      },
      {
        name: 'content',
        type: 'varchar',
        length: '200',
        isNullable: true,
      },
      {
        name: 'created_at',
        type: 'timestamp',
      },
    ],
  });

  private readonly userForeignKey = new TableForeignKey({
    columnNames: ['user_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'users',
    onDelete: 'CASCADE',
  });

  private readonly referenceThoughtsForeignKey = new TableForeignKey({
    columnNames: ['reference_thought_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'thoughts',
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKeys(this.table, [
      this.userForeignKey,
      this.referenceThoughtsForeignKey,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys(this.table, [
      this.userForeignKey,
      this.referenceThoughtsForeignKey,
    ]);
    await queryRunner.dropTable(this.table);
  }
}
