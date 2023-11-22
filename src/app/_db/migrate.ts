import {
  FileMigrationProvider,
  Migrator,
  NO_MIGRATIONS,
  PostgresIntrospector,
  sql,
} from 'kysely';
import { run } from 'kysely-migration-cli';
import { promises as fs } from 'fs';
import * as path from 'path';
import { db } from './db';
import * as address from './migrations/20231121T212636-address-table';
import * as nickname from './migrations/20231121T212732-nickname-table';
import { ESMFileMigrationProvider } from './esm-file-migration-provider';
export const migrator = new Migrator({
  db,
  provider: new ESMFileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, 'migrations'),
  }),
});

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
  // try {
  //   await nickname.down(db);
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   await address.down(db);
  // } catch (e) {
  //   console.log(e);
  // }

  await sql`drop table nickname`.execute(db).catch(() => {});
  await sql`drop table address`.execute(db).catch(() => {});

  // const introspector = new PostgresIntrospector(db);
  // const tables = await introspector.getTables();
  // if (tables.find((it) => it.name === 'nickname')) {
  //   await db.schema.dropTable('nickname').execute();
  // }

  // if (tables.find((it) => it.name === 'address')) {
  //   await db.schema.dropTable('address').execute();
  // }
}

if (require.main === module) {
  process.chdir(__dirname);
  run(db, migrator);
}
