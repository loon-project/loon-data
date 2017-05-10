import {ResultMapping} from "../src/mapping/ResultMapping";
import {expect} from 'chai';

describe("ResultMap", () => {

    class Developer {

    }


    class TestResultMapRepository {


        @ResultMapping({type: Developer})
        public listDeveloper() {
            return Promise.resolve(() => [
                {
                    id: 1,
                },
                {
                    id: 2
                }
            ]);
        }
    }


    it('should return the data if ResultMapping without enough information', async () => {

        const repo = new TestResultMapRepository();

        const result = await repo.listDeveloper();


        expect(Array.isArray(result)).to.be.true;
        expect(result.length).to.be.equal(2);
        expect(result[0].id).to.be.equal(1);
        expect(result[1].id).to.be.equal(2);
    });

});