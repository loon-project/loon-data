import {Property} from "loon";
import {expect} from "chai";
import {ResultsMapping} from "../src/mapping/ResultMapping";

describe("ResultsMapping", () => {

    class AResultsMappingTestUserClass {

        @Property()
        public id: number;

        @Property()
        public name: string;

        public lesson: AResultsMappingTestLessonClass;

        public galleries: AResultsMappingTestGalleryClass[];
    }

    class AResultsMappingTestLessonClass {

        @Property()
        public id: number;

        @Property()
        public title: string;

        @Property()
        public description: string;

    }

    class AResultsMappingTestGalleryClass {

        @Property()
        public id: number;

        @Property()
        public name: string;
    }

    const simpleMap = {
        type: AResultsMappingTestUserClass
    };

    const simple = [
        {
            id: 1,
            name: "Jack"
        },
        {
            id: 2,
            name: "Helen"
        }
    ];

    const associationMap = {
        type: AResultsMappingTestUserClass,
        prefix: 'user_',

        associations: [
            {
                property: 'lesson',
                type: AResultsMappingTestLessonClass,
                prefix: 'lesson_'
            }
        ]
    };

    const withAssociation = [
        {
            user_id: 1,
            user_name: "Jack",
            lesson_id: 1,
            lesson_title: "t1",
            lesson_description: "d1"
        },
        {
            user_id: 2,
            user_name: "Helen",
            lesson_id: 2,
            lesson_title: "t2",
            lesson_description: "d2"
        }
    ];

    const collectionMap = {
        type: AResultsMappingTestUserClass,
        prefix: 'user_',

        collections: [
            {
                property: 'galleries',
                type: AResultsMappingTestGalleryClass,
                prefix: 'gallery_'
            }
        ]
    };

    const withCollection = [
        {
            user_id: 1,
            user_name: "Jack",
            gallery_id: 0,
            gallery_name: "g1-0"
        },
        {
            user_id: 1,
            user_name: "Jack",
            gallery_id: 1,
            gallery_name: "g1-1"
        },
        {
            user_id: 1,
            user_name: "Jack",
            gallery_id: 2,
            gallery_name: "g1-2"
        },
        {
            user_id: 2,
            user_name: "Helen",
            gallery_id: null,
            gallery_name: null
        }
    ];


    class UserRepository {

        @ResultsMapping(simpleMap)
        public listUsers() {
            return simple;
        }

        @ResultsMapping(simpleMap)
        public asyncListUsers() {
            return Promise.resolve(simple);
        }

        @ResultsMapping(associationMap)
        public complexListUsersWithAssociation() {
            return withAssociation;
        }

        @ResultsMapping(associationMap)
        public asyncComplexListUsersWithAssociation() {
            return Promise.resolve(withAssociation);
        }

        @ResultsMapping(collectionMap)
        public complexListUsersWithCollection() {
            return withCollection;
        }

        @ResultsMapping(collectionMap)
        public asyncComplexListUsersWithCollection() {
            return Promise.resolve(withCollection);
        }
    }

    const repo = new UserRepository();

    it('should successfully convert results to class instance', () => {
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

    it('should successfully convert promise results to class instance', async () => {
        const users = await repo.asyncListUsers();

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

    it('should successfully convert results to class instance with association', () => {

        const users: any = repo.complexListUsersWithAssociation();

        users.map(( user, i) => {

            expect(user instanceof AResultsMappingTestUserClass).to.be.true;
            expect(user.lesson instanceof AResultsMappingTestLessonClass).to.be.true;
            expect(user.id).to.be.equal(i+1);

            if (i === 0) {
                expect(user.name).to.be.equal('Jack');
            } else {
                expect(user.name).to.be.equal('Helen');
            }
            expect(user.lesson.title).to.be.equal(`t${i+1}`);
            expect(user.lesson.description).to.be.equal(`d${i+1}`);
        });
    });

    it('should successfully convert promise results to class instance with association', async () => {

        const users: any = await repo.asyncComplexListUsersWithAssociation();

        users.map(( user, i) => {

            expect(user instanceof AResultsMappingTestUserClass).to.be.true;
            expect(user.lesson instanceof AResultsMappingTestLessonClass).to.be.true;
            expect(user.id).to.be.equal(i+1);

            if (i === 0) {
                expect(user.name).to.be.equal('Jack');
            } else {
                expect(user.name).to.be.equal('Helen');
            }
            expect(user.lesson.title).to.be.equal(`t${i+1}`);
            expect(user.lesson.description).to.be.equal(`d${i+1}`);
        });
    });

    it('should successfully convert results to class instance with collections', () => {

        const users: any = repo.complexListUsersWithCollection();

        users.map((user, i) => {

            expect(user instanceof AResultsMappingTestUserClass).to.be.true;
            expect(user.id).to.be.equal(i+1);

            if (i === 0) {

                user.galleries.map((gallery, j) => {

                    expect(gallery instanceof AResultsMappingTestGalleryClass).to.be.true;
                    expect(gallery.name).to.be.equal(`g${i+1}-${j}`);

                });

                expect(user.name).to.be.equal('Jack');
            } else {

                expect(user.name).to.be.equal('Helen');
                expect(user.galleries).to.be.undefined;
            }
        });
    });

    it('should successfully convert promise results to class instance with collections', async () => {

        const users: any = await repo.asyncComplexListUsersWithCollection();

        users.map((user, i) => {

            expect(user instanceof AResultsMappingTestUserClass).to.be.true;
            expect(user.id).to.be.equal(i+1);

            if (i === 0) {

                user.galleries.map((gallery, j) => {

                    expect(gallery instanceof AResultsMappingTestGalleryClass).to.be.true;
                    expect(gallery.name).to.be.equal(`g${i+1}-${j}`);

                });

                expect(user.name).to.be.equal('Jack');
            } else {

                expect(user.name).to.be.equal('Helen');
                expect(user.galleries).to.be.undefined;
            }
        });
    });
});