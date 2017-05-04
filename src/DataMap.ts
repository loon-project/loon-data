enum FetchType {
    LAZY,
    EAGER
}

export interface DataMap {

    type: Function;

    results?: ResultMap[];

    associations?: AssociationMap[];

    collections?: CollectionMap[];
}

export interface AssociationMap {

    property: string;

    type?: Function;

    // 处理结果时使用
    result?: DataMap;

    // 处理结果时使用
    results?: ResultMap[];

    // 处理结果时使用
    columnPrefix?: string;

    // 查询时使用
    fetchType?: FetchType;

    // 查询时使用
    select?: string;
}

export interface CollectionMap {

    property: string;

    type?: Function;

    result?: DataMap;

    association?: AssociationMap;

    collection?: CollectionMap;

    results?: ResultMap[];

    select?: string;
}


export interface ResultMap {
    property: string;
    column?: string;
    typeHandler?: (...args) => any;
}