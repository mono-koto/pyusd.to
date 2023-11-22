// import * as fs from 'fs/promises';
import {
  FileMigrationProviderProps,
  Migration,
  MigrationProvider,
} from 'kysely';

export class ESMFileMigrationProvider implements MigrationProvider {
  constructor(private props: FileMigrationProviderProps) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    const files = await this.props.fs.readdir(this.props.migrationFolder);

    for (const fileName of files) {
      const importPath = this.props.path
        .join(this.props.migrationFolder, fileName)
        .replaceAll('\\', '/');
      const migration = await import(importPath);
      const migrationKey = fileName.substring(0, fileName.lastIndexOf('.'));

      migrations[migrationKey] = migration;
    }

    return migrations;
  }
}
