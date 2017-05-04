import "./TestHelper";
import {expect} from 'chai';
import * as Knex from 'knex';
import {ResultsMap} from "../src/ResultMap";
import {Result} from "../src/Result";


describe("", () => {

    const client = Knex(require('./db/knexfile'));

    before(async () => {
        await client
            .from('users1')
            .insert({
                username: 'name1',
                hashedPassword: 'password1'
            });

        await client
            .from('users2')
            .insert({
                user_name: 'name2',
                hashed_password: "password2"
            })
    });

    after(async () => {
        await client.from('users1').del();
        await client.from('users2').del();
    });

    class User {
        id: number;
        username: string;
        hashedPassword: string;
    }

    const User1Result: Result = {
        type: User
    };

    const User2Result: Result = {
        type: User,
        results: [
            {
                property: 'id',
                column: 'user_id'
            },
            {
                property: 'username',
                column: 'user_name'
            },
            {
                property: 'hashedPassword',
                column: 'hashed_password'
            }
        ]
    };

    class UserRepository {

        @ResultsMap(User1Result)
        public selectUsers() {
            return client
                .select('id', 'username', 'hashedPassword')
                .from('users1');
        }

        @ResultsMap(User2Result)
        public selectUsers1() {
            return client
                .select()
                .from('users2');
        }
    }

    const repo = new UserRepository();

    it('can convert simple sql result', async () => {

        const users = await repo.selectUsers();

        const user = users[0];

        expect(user instanceof User).to.be.true;

        expect(user.username).to.be.equal("name1");
        expect(user.hashedPassword).to.be.equal("password1");
    });

    it('can convert simple sql with column map result', async () => {

        const users = await repo.selectUsers1();

        const user = users[0];

        expect(user instanceof User).to.be.true;

        expect(user.username).to.be.equal("name2");
        expect(user.hashedPassword).to.be.equal("password2");
    });

});
