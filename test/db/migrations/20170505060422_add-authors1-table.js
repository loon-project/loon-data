
exports.up = function(knex, Promise) {
  return knex.schema.createTable('authors1', table => {
    table.increments();
    table.string('username');
    table.string('password');
    table.string('email');
    table.string('bio');
    table.string('favourite_section');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('authors1');
};
