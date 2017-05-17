import {Property} from "loon";
import {expect} from "chai";
import {ResultsMapping} from "../src/mapping/ResultMapping";

describe("ResultsMapping", () => {

    class AResultsMappingTestUserClass {

        @Property()
        public id: number;

        @Property()
        public name: string;

    }

    class UserRepository {

        @ResultsMapping({type: AResultsMappingTestUserClass})
        public listUsers() {
            return [
                {
                    id: 1,
                    name: "Jack"
                },
                {
                    id: 2,
                    name: "Helen"
                }
            ]
        }
    }

    it('should successfully mapping result to class instance', () => {
        const repo = new UserRepository();
        const users = repo.listUsers();

        users.map((user, i) => {
            expect(user instanceof AResultsMappingTestUserClass).to.be.true;
            expect(user.id).to.be.equal(i+1);

            if (i === 0) {
                expect(user.name).to.be.equal('Jack');
            } else {
                expect(user.name).to.be.equal('Helen');
            }

        })

    });

});