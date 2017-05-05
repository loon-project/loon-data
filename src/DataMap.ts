enum FetchType {
    LAZY,
    EAGER
}

export interface Fetchable {
    // 查询时使用
    fetchType?: FetchType;

    // 查询时使用
    select?: string;
}

export interface Prefixable {

    // 处理结果时使用
    columnPrefix?: string;
}

export interface DataMap extends Prefixable {


    type?: Function;

    results?: ResultMap[];

    associations?: AssociationMap[];

    collections?: CollectionMap[];
}

export interface AssociationMap extends DataMap, Fetchable {

    property: string;

    // 处理结果时使用
    map?: DataMap;
}

export interface CollectionMap extends DataMap, Fetchable {

    property: string;

    // 处理结果时使用
    map?: DataMap;
}


export interface ResultMap {
    property: string;
    column?: string;
    idAttribute?: boolean;
    typeHandler?: (...args) => any;
}