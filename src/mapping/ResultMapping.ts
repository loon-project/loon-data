import {AssociationMap, CollectionMap, DataMap, ResultMap} from "../DataMap";
import * as _ from "lodash";

interface Klass {
    new (...args): any;
    name: string;
}

function isBlank(data) {
    return _.isUndefined(data) || _.isNull(data) || _.isEmpty(data) || _.isNaN(data);
}


class Wrapper {

    data: any;

    indexList: number[];

    constructor(data: any, currentIndex: number) {
        this.data = data;
        this.indexList = [currentIndex];
    }
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

    const uniqueInsList: Wrapper[] = [];

    insList.forEach((ins, index) => {

        if (isBlank(ins)) {
            return;
        }


        if (!Object.keys(ins).some(key => !_.isUndefined(ins[key]) || !_.isNull(ins[key]))) {
            return;
        }

        const uniqueResult = uniqueInsList.some(uniqueIns => {

            if (_.isEqual(ins, uniqueIns.data)) {
                uniqueIns.indexList.push(index);
                return true;
            }

            return false;
        });

        if (uniqueResult) {
            return;
        }

        const wrapper = new Wrapper(ins, index);

        uniqueInsList.push(wrapper);
    });


    if (isBlank(uniqueInsList)) {
        return;
    }

    uniqueInsList.forEach(wrapper => {

        const associations = <AssociationMap[]> map.associations;

        if (associations) {

            associations.map(association => {
                const associationIns = handleMap(data[wrapper.indexList[0]], association, false);
                wrapper.data[association.property] = associationIns;
            })
        }

        const collections = <CollectionMap[]> map.collections;

        if (collections) {

            collections.forEach(collection => {

                const collectionData = wrapper.indexList.map(index => data[index]);

                const collectionInsList = handleMap(collectionData, collection, true);

                wrapper.data[collection.property] = collectionInsList;
            });
        }

    });


    if (isCollection) {
        return uniqueInsList.map(_ => _.data);
    } else {
        return uniqueInsList[0].data;
    }

};



export function ResultMapping(map: DataMap) {

    return (target: any, key: string, descriptor) => {

        const method = descriptor.value;

        descriptor.value = async (...args) => {
            const data = await method.apply(target, args);
            return handleMap(data, map, false);
        };
    };
}

export function ResultsMapping(map: DataMap) {

    return (target: any, key: string, descriptor) => {

        const method = descriptor.value;

        descriptor.value = async (...args) => {
            const data = await method.apply(target, args);
            return handleMap(data, map, true);
        };

    };
}


