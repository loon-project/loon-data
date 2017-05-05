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

    const tag1 = {
        name: "great"
    };

    const tag2 = {
        name: "cloud"
    };

    const blog = {
        title: "great blog"
    };

    const post1 = {
        created_on: "2077-07-07",
        section: "s1",
        subject: "first blog",
        draft: true,
        body: "body 1"
    };

    const post2 = {
        created_on: "2077-07-17",
        section: "s2",
        subject: "second blog",
        draft: false,
        body: "body 2"
    };

    let blogId;

    before(async () => {


        const author1Id = await client.from('authors1').insert(author1);
        const author2Id = await client.from('authors1').insert(author2);

        const tag1Id = await client.from('tags1').insert(tag1);
        const tag2Id = await client.from('tags1').insert(tag2);

        blogId = await client
            .from('blogs1')
            .insert(Object.assign({}, blog, {author_id: author1Id}));

        const post1Id = await client
            .from('posts1')
            .insert(Object.assign({}, post1, {blog_id: blogId, author_id: author1Id}));

        const post2Id = await client
            .from('posts1')
            .insert(Object.assign({}, post2, {blog_id: blogId, author_id: author1Id}));


        await client
            .from('posts_tags1')
            .insert([
                {
                    post_id: post1Id,
                    tag_id: tag1Id
                },
                {
                    post_id: post1Id,
                    tag_id: tag2Id
                },
                {
                    post_id: post2Id,
                    tag_id: tag1Id
                }
            ]);

        await client
            .from('comments1')
            .insert([
                {
                    post_id: post1Id,
                    name: "1",
                    comment: "c1"
                },
                {
                    post_id: post1Id,
                    name: "2",
                    comment: "c2"
                },
                {
                    post_id: post1Id,
                    name: "3",
                    comment: "c3"
                }
            ])
    });

    after(async () => {
        await client.from('authors1').del();
        await client.from('blogs1').del();
        await client.from('comments1').del();
        await client.from('posts_tags1').del();
        await client.from('posts1').del();
        await client.from('tags1').del();
    });

    class Comment {
        public id: number;
        public postId: number;
        public name: string;
        public comment: string;
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

    class BlogRepository {

        @ResultsMap(BlogMap)
        public queryBlog(id: number) {
            return client.select(
                'B.id as blog_id',
                'B.title as blog_title',
                'B.author_id as blog_author_id',
                'A.id as author_id',
                'A.username as author_username',
                'A.password as author_password',
                'A.email as author_email',
                'A.bio as author_bio',
                'A.favourite_section as author_favourite_section',
                'P.id as post_id',
                'P.blog_id as post_blog_id',
                'P.author_id as post_author_id',
                'P.created_on as post_created_on',
                'P.section as post_section',
                'P.subject as post_subject',
                'P.draft as draft',
                'P.body as post_body',
                'C.id as comment_id',
                'C.post_id as comment_post_id',
                'C.name as comment_name',
                'C.comment as comment_text',
                'T.id as tag_id',
                'T.name as tag_name'
            )
                .from('blogs1 as B')
                .leftOuterJoin('authors1 as A', 'A.id', 'B.author_id')
                .leftOuterJoin('posts1 as P', 'P.blog_id', 'B.id')
                .leftOuterJoin('comments1 as C', 'C.post_id', 'P.id')
                .leftOuterJoin('posts_tags1 as PT', 'PT.post_id', 'P.id')
                .leftOuterJoin('tags1 as T', 'T.id', 'PT.tag_id')
                .where({'B.id': id});
        }
    }

    const repo = new BlogRepository();


    it('can convert complex type', async () => {

        const ret = await repo.queryBlog(blogId);

        console.log("123");
    });

});
