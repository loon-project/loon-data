export interface DataMap {

    // must be a type for conversion
    type: Function;

    // for complex query avoid of conflict
    prefix?: string;

    // default is column `id`, it could be any column used to distinguish difference between data in rows
    uniqueKey?: string;

    associations?: AssociationMap[];

    collections?: CollectionMap[];
}

export interface AssociationMap extends DataMap {
    property: string;
}

export interface CollectionMap extends DataMap {
    property: string;
}

