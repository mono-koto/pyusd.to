import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('address')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('value', 'varchar(42)', (col) =>
      col
        .notNull()
        .unique()
        .check(sql`value = lower(value)`)
        .check(sql`regexp_like(value, '^0x[0-9a-f]{40}$')`)
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createIndex('address_value_index')
    .on('address')
    .column('value')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('address').execute();
}
