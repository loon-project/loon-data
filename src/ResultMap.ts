import {AssociationMap, CollectionMap, DataMap, ResultMap} from "./DataMap";
import * as _ from 'lodash';

interface Klass {
    new (...args): any;
    name: string;
}

function isBlank(data) {
    return _.isUndefined(data) || _.isNull(data) || _.isEmpty(data) || _.isNaN(data);
}

const handleMap = (data: any, map: DataMap, isCollection: boolean) => {

    if (isBlank(data) || isBlank(map) || isBlank(map.results)) {
        return;
    }

    const results: ResultMap[]= <ResultMap[]> map.results;

    if (isBlank(results)) {
        return;
    }

    if (!_.isArray(data)) {
        data = [data];
    }

    const insList = data.map(item => {
        const type = <Klass> map.type;
        const ins = new type();

        Object.keys(item).forEach(column => {

            const resultMap = results.find(result => {

                const resultColumn = result.column ? result.column : result.property;

                return resultColumn === column;
            });

            if (resultMap) {
                const property = resultMap.property ? resultMap.property : column;
                ins[property] = item[column];
            }
        });

        return ins;
    });

    const uniqueInsList: any[] = [];

    insList.forEach(ins => {

        if (isBlank(ins)) {
            return;
        }

        if (uniqueInsList.some(uniqueIns => _.isEqual(ins, uniqueIns))) {
            return;
        }

        uniqueInsList.push(ins);
    });

    if (isBlank(uniqueInsList)) {
        return;
    }

    const associations = <AssociationMap[]> map.associations;

    if (associations) {

        associations.map(association => {

            const associationIns = handleMap(data, association, false);

            insList.forEach(ins => {
                ins[association.property] = associationIns;
            })
        })
    }

    const collections = <CollectionMap[]> map.collections;

    if (collections) {

        collections.forEach(collection => {

            const collectionInsList = handleMap(data, collection, true);

            insList.forEach(ins => {
                ins[collection.property] = collectionInsList;
            })
        });
    }

    if (isCollection) {
        return uniqueInsList;
    } else {
        return uniqueInsList[0];
    }

};



export function ResultMaping(map: DataMap) {

    return (target: any, key: string, descriptor) => {

        const method = descriptor.value;

        descriptor.value = async (...args) => {

            const data = await method.apply(target, args);

            return handleMap(data, map, false);
        };
    };
}

export function ResultsMaping(map: DataMap) {

    return (target: any, key: string, descriptor) => {

        const method = descriptor.value;

        descriptor.value = async (...args) => {

            const type = <Klass> map.type;
            const results = map.results;

            const ret = await method.apply(target, args);

            if (_.isEmpty(ret) || _.isEmpty(results)) {
                return;
            }

            if (_.isArray(ret)) {
                const insRet = ret.map(item => {

                    let ins;

                    Object.keys(item).forEach(column => {
                        const resultMap = (<ResultMap[]> results).find(item => item.column === column);

                        if (resultMap) {

                            if (typeof ins === 'undefined') {
                                ins = new type();
                            }

                            const property = resultMap.property ? resultMap.property : column;
                            ins[property] = item[column];
                        }
                    });

                    return ins;
                });

                return _.compact(insRet);
            }
        };

    };
}


