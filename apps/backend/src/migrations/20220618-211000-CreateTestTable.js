
export async function up(db) {
  await db.schema.createTable('test')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('text', 'varchar(50)', (col) => col.notNull())
    .execute();
}

export async function down(db) {
  await db.schema.dropTable('test').execute();
}
