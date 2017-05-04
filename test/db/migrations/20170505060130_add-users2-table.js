
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users2', table => {
    table.increments('user_id');
    table.string('user_name');
    table.string('hashed_password');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users2");
};

