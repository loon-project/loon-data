
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users1', table => {
    table.increments();
    table.string('username');
    table.string('hashedPassword');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users1");
};
