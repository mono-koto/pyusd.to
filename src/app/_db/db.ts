import { Database } from '@/app/_db/types'; // this is the Database interface we defined earlier
import { createKysely } from '@vercel/postgres-kysely';

import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import dotenv from 'dotenv';
dotenv.config();

function createDevKysely() {
  const dialect = new PostgresDialect({
    pool: new Pool({
      database: 'postgres',
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      port: 5432,
      max: 10,
    }),
  });
  return new Kysely<Database>({ dialect });
}

export const db =
  process.env.NODE_ENV === 'production'
    ? createKysely<Database>({
        connectionString: process.env.POSTGRES_URL,
      })
    : createDevKysely();

// hack to help vercel postgres not worry about transacitonal migrations:
// https://github.com/vercel/storage/issues/325
if (process.env.NODE_ENV === 'production') {
  Object.defineProperty(
    db.getExecutor().adapter,
    'supportsTransactionalDdl',
    () => false
  );
}
