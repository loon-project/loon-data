import * as Knex from "knex";


const client = Knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'lion_development',
        timezone: 'utc'
    },
    pool: {
        min: 10,
        max: 10
    }
});


client.from('users').limit(1).then(data => {
    console.log(Array.isArray(data));
    console.log(data);
});

