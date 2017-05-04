
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments1', table => {
    table.increments();
    table.integer('post_id');
    table.string('name');
    table.string('comment');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments1');
};
