import "./TestHelper";
import {expect} from "chai";
import {ResultMapping} from "../src/decorators/ResultMapping";
import {AssociationMap, DataMap} from "../src/DataMap";
import {Property} from "loon";

describe("ComplexResultsMap", () => {

    const author1 = {
        username: 'Jack',
        password: 'password',
        email: 'jack@gmail.com',
        favourite_section: 'NO.1'
    };

    const author2 = {
        username: 'Helen',
        password: 'password',
        email: 'helen@gmail.com',
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

    class Comment {

        @Property()
        public id: number;

        @Property()
        public postId: number;

        @Property()
        public name: string;

        public comment: string;
    }

    class Tag {

        @Property()
        public id: number;
    }

    class Author {

        @Property()
        public id: number;

        @Property()
        public username: string;

        @Property()
        public password: string;

        @Property()
        public email: string;

        @Property()
        public bio: string;

        @Property('favourite_section')
        public favouriteSection: string;
    }

    class Post {

        @Property()
        public id: number;

        @Property()
        public subject: string;

        public author: Author;

        public comments: Comment[];

        public tags: Tag[];
    }

    class Blog {

        @Property()
        public id: number;

        @Property()
        public title: string;

        public author: Author;

        public posts: Post[];
    }

    const AuthorMap: AssociationMap = {
        property: 'author',
        type: Author,
        prefix: 'author_'
    };

    const BlogMap: DataMap = {

        type: Blog,

        prefix: 'blog_',

        associations: [
            AuthorMap
        ],

        collections: [
            {
                property: 'posts',
                type: Post,
                prefix: 'post_',

                associations: [
                    AuthorMap
                ],

                collections: [
                    {
                        property: 'comments',
                        type: Comment,
                        prefix: 'comment_'
                    },

                    {
                        property: 'tags',
                        type: Tag,
                        prefix: 'tag_'
                    }
                ]

            }
        ]

    };
    /**
     * SQL:
     * select(
     *     'B.id as blog_id',
     *     'B.title as blog_title',
     *     'B.author_id as blog_author_id',
     *     'A.id as author_id',
     *     'A.username as author_username',
     *     'A.password as author_password',
     *     'A.email as author_email',
     *     'A.bio as author_bio',
     *     'A.favourite_section as author_favourite_section',
     *     'P.id as post_id',
     *     'P.blog_id as post_blog_id',
     *     'P.author_id as post_author_id',
     *     'P.created_on as post_created_on',
     *     'P.section as post_section',
     *     'P.subject as post_subject',
     *     'P.draft as post_draft',
     *     'P.body as post_body',
     *     'C.id as comment_id',
     *     'C.post_id as comment_post_id',
     *     'C.name as comment_name',
     *     'C.comment as comment_text',
     *     'T.id as tag_id',
     *     'T.name as tag_name'
     *   )
     *   .from('blogs1 as B')
     *   .leftOuterJoin('authors1 as A', 'A.id', 'B.author_id')
     *   .leftOuterJoin('posts1 as P', 'P.blog_id', 'B.id')
     *   .leftOuterJoin('comments1 as C', 'C.post_id', 'P.id')
     *   .leftOuterJoin('posts_tags1 as PT', 'PT.post_id', 'P.id')
     *   .leftOuterJoin('tags1 as T', 'T.id', 'PT.tag_id')
     *   .where({'B.id': id})
     *
     * Tables:
     *   CREATE TABLE `authors1` (
     *     `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
     *     `username` varchar(255) DEFAULT NULL,
     *     `password` varchar(255) DEFAULT NULL,
     *     `email` varchar(255) DEFAULT NULL,
     *     `bio` varchar(255) DEFAULT NULL,
     *     `favourite_section` varchar(255) DEFAULT NULL,
     *     PRIMARY KEY (`id`)
     *   ) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;
     *
     *   CREATE TABLE `blogs1` (
     *     `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
     *     `title` varchar(255) DEFAULT NULL,
     *     `author_id` int(11) DEFAULT NULL,
     *     PRIMARY KEY (`id`)
     *   ) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

     *   CREATE TABLE `comments1` (
     *     `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
     *     `post_id` int(11) DEFAULT NULL,
     *     `name` varchar(255) DEFAULT NULL,
     *     `comment` varchar(255) DEFAULT NULL,
     *     PRIMARY KEY (`id`)
     *   ) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8;

     *   CREATE TABLE `posts_tags1` (
     *     `post_id` int(11) DEFAULT NULL,
     *     `tag_id` int(11) DEFAULT NULL
     *   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

     *   CREATE TABLE `posts1` (
     *     `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
     *     `blog_id` int(11) DEFAULT NULL,
     *     `author_id` int(11) DEFAULT NULL,
     *     `created_on` varchar(255) DEFAULT NULL,
     *     `section` varchar(255) DEFAULT NULL,
     *     `subject` varchar(255) DEFAULT NULL,
     *     `draft` tinyint(1) DEFAULT NULL,
     *     `body` varchar(255) DEFAULT NULL,
     *     PRIMARY KEY (`id`)
     *   ) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;

     *   CREATE TABLE `tags1` (
     *     `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
     *     `name` varchar(255) DEFAULT NULL,
     *     PRIMARY KEY (`id`)
     *   ) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;

     *   CREATE TABLE `users1` (
     *     `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
     *     `username` varchar(255) DEFAULT NULL,
     *     `hashedPassword` varchar(255) DEFAULT NULL,
     *     PRIMARY KEY (`id`)
     *   ) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
     */

    class BlogRepository {

        @ResultMapping(BlogMap)
        public queryBlog() {
            return [
                {
                    "blog_id": 44,
                    "blog_title": "great blog",
                    "blog_author_id": 87,
                    "author_id": 87,
                    "author_username": "Jack",
                    "author_password": "password",
                    "author_email": "jack@gmail.com",
                    "author_bio": null,
                    "author_favourite_section": "NO.1",
                    "post_id": 87,
                    "post_blog_id": 44,
                    "post_author_id": 87,
                    "post_created_on": "2077-07-07",
                    "post_section": "s1",
                    "post_subject": "first blog",
                    "post_draft": 1,
                    "post_body": "body 1",
                    "comment_id": 130,
                    "comment_post_id": 87,
                    "comment_name": "1",
                    "comment_text": "c1",
                    "tag_id": 87,
                    "tag_name": "great"
                },
                {
                    "blog_id": 44,
                    "blog_title": "great blog",
                    "blog_author_id": 87,
                    "author_id": 87,
                    "author_username": "Jack",
                    "author_password": "password",
                    "author_email": "jack@gmail.com",
                    "author_bio": null,
                    "author_favourite_section": "NO.1",
                    "post_id": 87,
                    "post_blog_id": 44,
                    "post_author_id": 87,
                    "post_created_on": "2077-07-07",
                    "post_section": "s1",
                    "post_subject": "first blog",
                    "post_draft": 1,
                    "post_body": "body 1",
                    "comment_id": 131,
                    "comment_post_id": 87,
                    "comment_name": "2",
                    "comment_text": "c2",
                    "tag_id": 87,
                    "tag_name": "great"
                },
                {
                    "blog_id": 44,
                    "blog_title": "great blog",
                    "blog_author_id": 87,
                    "author_id": 87,
                    "author_username": "Jack",
                    "author_password": "password",
                    "author_email": "jack@gmail.com",
                    "author_bio": null,
                    "author_favourite_section": "NO.1",
                    "post_id": 87,
                    "post_blog_id": 44,
                    "post_author_id": 87,
                    "post_created_on": "2077-07-07",
                    "post_section": "s1",
                    "post_subject": "first blog",
                    "post_draft": 1,
                    "post_body": "body 1",
                    "comment_id": 132,
                    "comment_post_id": 87,
                    "comment_name": "3",
                    "comment_text": "c3",
                    "tag_id": 87,
                    "tag_name": "great"
                },
                {
                    "blog_id": 44,
                    "blog_title": "great blog",
                    "blog_author_id": 87,
                    "author_id": 87,
                    "author_username": "Jack",
                    "author_password": "password",
                    "author_email": "jack@gmail.com",
                    "author_bio": null,
                    "author_favourite_section": "NO.1",
                    "post_id": 87,
                    "post_blog_id": 44,
                    "post_author_id": 87,
                    "post_created_on": "2077-07-07",
                    "post_section": "s1",
                    "post_subject": "first blog",
                    "post_draft": 1,
                    "post_body": "body 1",
                    "comment_id": 130,
                    "comment_post_id": 87,
                    "comment_name": "1",
                    "comment_text": "c1",
                    "tag_id": 88,
                    "tag_name": "cloud"
                },
                {
                    "blog_id": 44,
                    "blog_title": "great blog",
                    "blog_author_id": 87,
                    "author_id": 87,
                    "author_username": "Jack",
                    "author_password": "password",
                    "author_email": "jack@gmail.com",
                    "author_bio": null,
                    "author_favourite_section": "NO.1",
                    "post_id": 87,
                    "post_blog_id": 44,
                    "post_author_id": 87,
                    "post_created_on": "2077-07-07",
                    "post_section": "s1",
                    "post_subject": "first blog",
                    "post_draft": 1,
                    "post_body": "body 1",
                    "comment_id": 131,
                    "comment_post_id": 87,
                    "comment_name": "2",
                    "comment_text": "c2",
                    "tag_id": 88,
                    "tag_name": "cloud"
                },
                {
                    "blog_id": 44,
                    "blog_title": "great blog",
                    "blog_author_id": 87,
                    "author_id": 87,
                    "author_username": "Jack",
                    "author_password": "password",
                    "author_email": "jack@gmail.com",
                    "author_bio": null,
                    "author_favourite_section": "NO.1",
                    "post_id": 87,
                    "post_blog_id": 44,
                    "post_author_id": 87,
                    "post_created_on": "2077-07-07",
                    "post_section": "s1",
                    "post_subject": "first blog",
                    "post_draft": 1,
                    "post_body": "body 1",
                    "comment_id": 132,
                    "comment_post_id": 87,
                    "comment_name": "3",
                    "comment_text": "c3",
                    "tag_id": 88,
                    "tag_name": "cloud"
                },
                {
                    "blog_id": 44,
                    "blog_title": "great blog",
                    "blog_author_id": 87,
                    "author_id": 87,
                    "author_username": "Jack",
                    "author_password": "password",
                    "author_email": "jack@gmail.com",
                    "author_bio": null,
                    "author_favourite_section": "NO.1",
                    "post_id": 88,
                    "post_blog_id": 44,
                    "post_author_id": 87,
                    "post_created_on": "2077-07-17",
                    "post_section": "s2",
                    "post_subject": "second blog",
                    "post_draft": 0,
                    "post_body": "body 2",
                    "comment_id": null,
                    "comment_post_id": null,
                    "comment_name": null,
                    "comment_text": null,
                    "tag_id": 87,
                    "tag_name": "great"
                }
            ];
        }
    }



    it('can convert complex type', () => {

        const repo = new BlogRepository();

        const blog: any = repo.queryBlog();

        expect(blog instanceof Blog).to.be.true;
        expect(blog.id).to.be.equal(44);
        expect(blog.title).to.be.equal(blog.title);

        const blogAuthor = blog.author;

        expect(blogAuthor).to.be.not.undefined;
        expect(blogAuthor instanceof Author).to.be.true;
        expect(blogAuthor.username).to.be.equal("Jack");
        expect(blogAuthor.password).to.be.equal("password");
        expect(blogAuthor.email).to.be.equal("jack@gmail.com");
        expect(blogAuthor.favouriteSection).to.be.equal("NO.1");

        const blogPostList = blog.posts;
        expect(blogPostList instanceof Array).to.be.true;
        expect(blogPostList.length).to.be.equal(2);


        const blogPost1 = blogPostList[0];
        expect(blogPost1 instanceof Post).to.be.true;

        const blogPost2 = blogPostList[1];
        expect(blogPost2 instanceof Post).to.be.true;

    });
});
