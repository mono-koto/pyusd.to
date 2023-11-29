import { promises as fs } from 'fs';
import { Migrator, NO_MIGRATIONS, sql } from 'kysely';
import { run } from 'kysely-migration-cli';
import * as path from 'path';
import { db } from './db';
import { ESMFileMigrationProvider } from './esm-file-migration-provider';
export const migrator = new Migrator({
  db,
  provider: new ESMFileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, 'migrations'),
  }),
});
import dotenv from 'dotenv';
dotenv.config();

export async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}

export async function resetMigrations() {
  const { error, results } = await migrator.migrateTo(NO_MIGRATIONS);

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}

export async function reset() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('reset() should only be called in tests');
  }

  await sql`drop table nickname`.execute(db).catch(() => {});
  await sql`drop table address`.execute(db).catch(() => {});
}

if (require.main === module) {
  console.log('env', process.env.NODE_ENV);
  process.chdir(__dirname);
  run(db, migrator);
}
