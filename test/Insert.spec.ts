import {expect} from 'chai';
import {Property, IConverter} from "loon";
import * as Knex from 'knex';
import {ResultMapping} from "../src/ResultMap";

function Entity() {
    return (target, key, descriptor) => {
    }
}

class SkillConverter implements IConverter {

}



describe("Insert", () => {




    class Developer {

        @Property()
        public name: string;

        @Property({converter: })
        public skills: string[];
    }


    const client = Knex(require('./db/knexfile'));


    class PeopleRepository {

        public insertDeveloper(@Entity() developer: Developer) {
            return client.from('users').insert(developer);
        }

        @ResultMapping({type: Developer})
        public findBy(id: number) {
            return client.from('users').where({id});
        }

    }

});