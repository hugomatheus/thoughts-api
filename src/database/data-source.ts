import 'dotenv/config';
import * as path from 'path';

import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { entities } from './database-entities';

export const ormOptions: DataSourceOptions & SeederOptions = {
  type: process.env.DATABASE_TYPE as 'mysql' | 'postgres' | 'sqlite',
  host: process.env.DATABASE_HOST,
  port: +(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities,
  migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: false,
} as DataSourceOptions & SeederOptions;

export const AppDataSource = new DataSource(ormOptions);
