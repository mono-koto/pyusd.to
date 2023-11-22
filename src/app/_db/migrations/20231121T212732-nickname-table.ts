import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('nickname')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('value', 'varchar', (col) => col.notNull().unique())
    .addColumn('address_id', 'integer', (col) =>
      col.notNull().references('address.id').onDelete('cascade')
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createIndex('nickname_name_index')
    .on('nickname')
    .column('value')
    .execute();

  await db.schema
    .createIndex('nickname_address_id_index')
    .on('nickname')
    .column('address_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('nickname').cascade().execute();
}
