import "./TestHelper";
import {expect} from 'chai';
import * as Knex from 'knex';
import {ResultsMap} from "../src/ResultMap";
import {DataMap} from "../src/DataMap";

describe("ComplexResultsMap", () => {

    const client = Knex(require('./db/knexfile'));

    const author1 = {
        username: 'Jack',
        password: 'password',
        email: 'jack@gmail.com',
        bio: 'tech',
        favourite_section: 'NO.1'
    };

    const author2 = {
        username: 'Helen',
        password: 'password',
        email: 'helen@gmail.com',
        bio: 'history',
        favourite_section: 'NO.1'
    };

    before(async () => {


        const author1Id = await client.from('authors1').insert(author1);
        const author2Id = await client.from('authors1').insert(author2);

        client.from('tags1')

    });

    after(async () => {
    });

    class Comment {
        public id: number;
    }

    class Tag {
        public id: number;
    }

    class Author {
        public id: number;
        public username: string;
        public password: string;
        public email: string;
        public bio: string;
        public favouriteSection: string;
    }

    class Post {
        public id: number;
        public subject: string;
        public author: Author;
        public comments: Comment[];
        public tags: Tag[];
    }

    class Blog {
        public id: number;
        public title: string;
        public author: Author;
        public posts: Post[];
    }

    const BlogMap: DataMap = {

        type: Blog,

        results: [
            {
                property: 'id',
                column: 'blog_id'
            },

            {
                property: 'title',
                column: 'blog_title'
            }
        ],

        associations: [
            {
                property: 'author',
                type: Author,
                results: [
                    {
                        property: 'username',
                        column: 'author_username'
                    },

                    {
                        property: 'password',
                        column: 'author_password'
                    },

                    {
                        property: 'email',
                        column: 'author_email'
                    },

                    {
                        property: 'bio',
                        column: 'author_bio'
                    },

                    {
                        property: 'favouriteSection',
                        column: 'author_favourite_section'
                    }
                ]
            }
        ],

        collections: [
            {
                property: 'posts',
                type: Post,
                results: [
                    {
                        property: 'id',
                        column: 'post_id'
                    },

                    {
                        property: 'subject',
                        column: 'post_subject'
                    }
                ],
                associations: [
                    {
                        property: 'author',
                        type: Author
                    }
                ],
                collections: [
                    {
                        property: 'comments',
                        type: Comment,
                        results: [
                            {
                                property: 'id',
                                column: 'comment_id'
                            }
                        ]
                    },

                    {
                        property: 'tags',
                        type: Tag,
                        results: [
                            {
                                property: 'id',
                                column: 'tag_id'
                            }
                        ]
                    }
                ]

            }
        ]

    };



});
