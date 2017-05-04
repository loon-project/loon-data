
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts1', table => {
    table.increments();
    table.integer('blog_id');
    table.integer('author_id');
    table.string('created_on');
    table.string('section');
    table.string('subject');
    table.boolean('draft');
    table.string('body');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts1');
};
