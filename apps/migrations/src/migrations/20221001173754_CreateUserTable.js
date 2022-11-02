
exports.up = async (knex) => {
  return knex.schema.createTable('user', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('sub').defaultTo(null);
    table.string('email', 255).defaultTo(null);
    table.string('first_name', 255).defaultTo(null);
    table.string('last_name', 255).defaultTo(null);
    table.timestamps(true, true);
  });
}

exports.down = async (knex) => {
  return knex.schema.dropTable('user');
};
