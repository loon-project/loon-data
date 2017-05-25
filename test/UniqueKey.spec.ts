import {expect} from 'chai';
import {Property} from "loon";
import {ResultMapping} from "../src/mapping/ResultMapping";


describe('UniqueKey', () => {

    class User {

        @Property()
        public uuid: string;

        @Property()
        public name: string;

        public lessons: Lesson[];
    }

    class Lesson {

        @Property()
        public id: number;

        @Property()
        public title: string;

    }


    class UserRepository {

        @ResultMapping({
            type: User,
            uniqueKey: 'uuid',
            prefix: 'user_',
            collections: [
                {
                    type: Lesson,
                    property: 'lessons',
                    prefix: 'lesson_'
                }
            ]
        })
        public findUser() {
            return [
                {
                    user_uuid: "uu",
                    user_name: "Jack",
                    lesson_id: 1,
                    lesson_title: "t1"
                },
                {
                    user_uuid: "uu",
                    user_name: "Jack",
                    lesson_id: 2,
                    lesson_title: 't2'
                },
            ]
        }
    }

    it('should use uuid as unique key', () => {

        const userRepo = new UserRepository();

        const user: any = userRepo.findUser();

        expect(user instanceof User).to.be.true;
        expect(user.uuid).to.be.equal('uu');
        expect(user.name).to.be.equal('Jack');
        expect(user.lessons.length).to.be.equal(2);

        expect(user.lessons[0].id).to.be.equal(1);
        expect(user.lessons[0].title).to.be.equal('t1');
        expect(user.lessons[1].id).to.be.equal(2);
        expect(user.lessons[1].title).to.be.equal('t2');
    });
});