import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entities } from '../../database/database-entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<'mysql' | 'postgres' | 'sqlite'>(
          'DATABASE_TYPE',
        ) as 'mysql' | 'postgres' | 'sqlite',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities,
        logging: false,
        migrations: [
          path.join(__dirname, '../../database/migrations/*{.ts,.js}'),
        ],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
