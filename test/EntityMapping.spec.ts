import {expect} from 'chai';
import {Property, IConverter, Service} from "loon";
import * as Knex from 'knex';
import {ResultMapping} from "../src/mapping/ResultMapping";
import {EntityMapping} from "../src/mapping/EntityMapping";


describe("EntityMapping", () => {


    class Developer {

        @Property()
        public name: string;

        @Property({name: "skillsContent"})
        public skills: string[];
    }

    class PeopleRepository {

        @EntityMapping()
        public insertDeveloper(developer: Developer) {
            return developer;
        }

    }

    it('can convert EntityMapping to js object', () => {

        const repo = new PeopleRepository();
        const developer = new Developer();

        developer.name = "AAA";
        developer.skills = ["code", "design"];

        const result = <any> repo.insertDeveloper(developer);


        expect(result instanceof Developer).to.be.false;
        expect(result.name).to.be.equal("AAA");
        expect(result.skillsContent).to.be.deep.equal(["code", "design"])
    });
});