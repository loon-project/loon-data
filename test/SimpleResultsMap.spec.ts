import "./TestHelper";
import {expect} from 'chai';
import * as Knex from 'knex';
import {ResultsMap} from "../src/ResultMap";
import {Result} from "../src/Result";


describe("", () => {

    const client = Knex({
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
    });



    it('can convert simple sql result', async () => {

        class User {
            id: number;
            username: string;
            hashedPassword: string;
        }

        const UserResult: Result = {
            type: User
        };

        @ResultsMap(UserResult)
        function selectUsers(id: number) {
            return client
                .select('id', 'username', 'hashedPassword')
                .from('users')
                .where({id});
        }

        const users = await selectUsers(1);

        const user = users[0];

        expect(user instanceof User).to.be.true;
        expect(users[0].id).to.be.equal(1);
    });

});
