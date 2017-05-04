
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts_tags1', table => {
    table.integer('post_id');
    table.integer('tag_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts_tags1');
};
