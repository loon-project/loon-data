import {ResultMapping} from "../src/decorators/ResultMapping";
import {expect} from "chai";
import {Property} from "loon";

describe("ResultMapping", () => {

    class AResultMapTestUserClass {

        @Property()
        public id: number;

        @Property()
        public username: string;

        public lesson: AResultMapTestLessonClass;

        public friends: AResultMapTestUserClass[];
    }

    class AResultMapTestLessonClass {

        @Property()
        public id: number;

        @Property()
        public title: string;

    }

    const simple = [
        {
            id: 1,
            username: 'n'
        }
    ];

    const simpleMap = {
        type: AResultMapTestUserClass
    };

    const withAssociation = [
        {
            user_id: 1,
            user_username: 'n',
            lesson_id: 1,
            lesson_title: 'l'
        }
    ];

    const associationMap = {
        type: AResultMapTestUserClass,
        prefix: 'user_',

        associations: [
            {
                property: 'lesson',
                type: AResultMapTestLessonClass,
                prefix: 'lesson_'
            }
        ]
    };

    const withCollection = [
        {
            user_id: 1,
            user_username: 'n',
            friend_id: 3,
            friend_username: 'f3'
        },
        {
            user_id: 1,
            user_username: 'n',
            friend_id: 4,
            friend_username: 'f4'
        }
    ];

    const collectionMap = {
        type: AResultMapTestUserClass,
        prefix: 'user_',

        collections: [
            {
                property: 'friends',
                type: AResultMapTestUserClass,
                prefix: 'friend_'
            }
        ]
    };


    class TestResultMapRepository {

        @ResultMapping(simpleMap)
        public findUser() {
            return simple;
        }


        @ResultMapping(simpleMap)
        public asyncFindUser() {
            return Promise.resolve(simple);
        }

        @ResultMapping(associationMap)
        public findUserWithLesson() {
            return withAssociation;
        }

        @ResultMapping(associationMap)
        public asyncFindUserWithLesson() {
            return Promise.resolve(withAssociation);
        }

        @ResultMapping(collectionMap)
        public findUserWithFriends() {
            return withCollection;
        }

        @ResultMapping(collectionMap)
        public asyncFindUserWithFriends() {
            return Promise.resolve(withCollection);
        }
    }

    const repo = new TestResultMapRepository();

    it('should successfully convert result to class instance', () => {

        const user: any = repo.findUser();

        assertUser(user);
    });

    it('should successfully convert a promise result to class instance', async () => {

        const user: any = await repo.asyncFindUser();

        assertUser(user);
    });

    it('should successfully convert result to class instance with association', () => {

        const user: any = repo.findUserWithLesson();

        assertUser(user);

        expect(user.lesson instanceof AResultMapTestLessonClass).to.be.true;
        expect(user.lesson.id).to.be.equal(1);
        expect(user.lesson.title).to.be.equal('l');
    });

    it('should successfully convert a promise result to class instance with association', async () => {

        const user: any = await repo.asyncFindUserWithLesson();

        assertUser(user);

        expect(user.lesson instanceof AResultMapTestLessonClass).to.be.true;
        expect(user.lesson.id).to.be.equal(1);
        expect(user.lesson.title).to.be.equal('l');
    });

    it('should successfully convert result to class instance with collections', () => {

        const user: any = repo.findUserWithFriends();

        assertUser(user);

        user.friends.map((friend, i) => {
            expect(friend instanceof AResultMapTestUserClass).to.be.true;
            expect(friend.id).to.be.equal(i+3);
            expect(friend.username).to.be.equal(`f${i+3}`);
        });
    });

    it('should successfully convert a promise result to class instance with collection', async () => {

        const user: any = await repo.asyncFindUserWithFriends();

        assertUser(user);

        user.friends.map((friend, i) => {
            expect(friend instanceof AResultMapTestUserClass).to.be.true;
            expect(friend.id).to.be.equal(i+3);
            expect(friend.username).to.be.equal(`f${i+3}`);
        });
    });


    function assertUser(user) {
        expect(user instanceof AResultMapTestUserClass);
        expect(user.id).to.be.equal(1);
        expect(user.username).to.be.equal('n');
    }

});