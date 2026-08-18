/**
 * Plain TypeORM DataSource, used ONLY by the TypeORM CLI
 * (migration:generate / migration:run / migration:revert).
 *
 * The app itself connects via TypeOrmModule.forRootAsync in app.module.ts,
 * which pulls the same env vars through NestJS's ConfigService. This file
 * exists separately because the TypeORM CLI can't run through Nest's DI —
 * it needs a plain DataSource it can import directly.
 *
 * Run these from inside the backend container, where the DB_* env vars
 * from docker-compose.yml are already set:
 *
 *   docker compose exec backend npm run migration:generate -- src/migrations/InitialSchema
 *   docker compose exec backend npm run migration:run
 *   docker compose exec backend npm run migration:revert
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});