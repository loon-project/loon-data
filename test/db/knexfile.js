module.exports = {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'loon_data_test',
    timezone: 'utc'
  },
  pool: {
    min: 10,
    max: 10
  }
};