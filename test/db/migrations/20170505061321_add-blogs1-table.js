
exports.up = function(knex, Promise) {
  return knex.schema.createTable('blogs1', table => {
    table.increments();
    table.string('title');
    table.integer('author_id');
  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('blogs1');
};
