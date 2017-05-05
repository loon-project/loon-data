const knex = require('knex');
const knexConfig = require('./knexfile');

knexConfig.connection.database = null;

const client = knex(knexConfig);

client.raw(`CREATE DATABASE loon_data_test CHARACTER SET utf8 COLLATE utf8_general_ci`)
  .then(() => {
    console.log(`DATABASE loon_data_test is created`);
    client.destroy();
    return 0;
  })
  .catch((e) => {
    client.destroy();
    return 0;
  });



