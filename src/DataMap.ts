export interface DataMap {

    // must be a type for conversion
    type: Function;

    // for complex query avoid of conflict
    prefix?: string;

    // improve the performance
    primaryKey?: string;

    associations?: AssociationMap[];

    collections?: CollectionMap[];
}

export interface AssociationMap extends DataMap {
    property: string;
}

export interface CollectionMap extends DataMap {
    property: string;
}

