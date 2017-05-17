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
        public title: string;

        @Property()
        public description: string;

    }

    class AResultsMappingTestGalleryClass {

        @Property()
        public name: string;
    }


    class UserRepository {

        @ResultsMapping({
            type: AResultsMappingTestUserClass
        })
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

        @ResultsMapping({
            type: AResultsMappingTestUserClass,
            prefix: 'user_',

            associations: [
                {
                    property: 'lesson',
                    type: AResultsMappingTestLessonClass,
                    prefix: 'lesson_'
                }
            ]


        })
        public complexListUsersWithAssociation() {
            return [
                {
                    user_id: 1,
                    user_name: "Jack",
                    lesson_title: "t1",
                    lesson_description: "d1"
                },
                {
                    user_id: 2,
                    user_name: "Helen",
                    lesson_title: "t2",
                    lesson_description: "d2"
                }
            ]
        }

        @ResultsMapping({
            type: AResultsMappingTestUserClass,
            prefix: 'user_',

            collections: [
                {
                    property: 'galleries',
                    type: AResultsMappingTestGalleryClass,
                    prefix: 'gallery_'
                }
            ]


        })
        public complexListUsersWithCollection() {
            return [
                {
                    user_id: 1,
                    user_name: "Jack",
                    gallery_name: "g1-0"
                },
                {
                    user_id: 1,
                    user_name: "Jack",
                    gallery_name: "g1-1"
                },
                {
                    user_id: 1,
                    user_name: "Jack",
                    gallery_name: "g1-2"
                },
                {
                    user_id: 2,
                    user_name: "Helen",
                    gallery_name: null
                }
            ];
        }

    }

    const repo = new UserRepository();

    it('should successfully mapping results to class instance', () => {
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

    it('should successfully mapping results to class instance with association', () => {

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

    it('should successfully mapping results to class instance with collections', () => {

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

});