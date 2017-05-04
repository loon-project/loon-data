import * as Knex from 'knex';
import {Result} from "./Result";
import {ResultsMap} from './ResultMap';



const client = Knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'lion_development',
        timezone: 'utc'
    },
    pool: {
        min: 10,
        max: 10
    }
});

class User {

    private id: number;

    private avatar: string;

}

class Like {

    private id: number;

    private likeableType: string;

}

class Gallery {

    private userId: number;

    private creator: User;

    private likes: Like[];
}

const UserResult: Result = {
    type: User
};

const LikeResult: Result = {
    type: Like,
    results: [
        {
            property: 'likeableType',
            column: 'likeable_type'
        }
    ]
};

const GalleryResult: Result = {

    type: Gallery,

    results: [
        {
            property: 'userId',
            column: 'g_user_id'
        }
    ],


    associations: [
        {
            property: 'creator',
            result: UserResult
        }
    ],

    collections: [
        {
            property: 'likes',
            result: LikeResult
        }
    ]
};

@ResultsMap(GalleryResult)
function queryUser(id: number) {
    client
        .from('galleries as g')
        .select(
            'g.id as g_id' +
            'g.user_id as g_user_id')
        .innerJoin('g.')
}
