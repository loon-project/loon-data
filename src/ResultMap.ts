import {DataMap, ResultMap} from "./DataMap";
import * as _ from 'lodash';

interface Klass {
    new (...args): any;
    name: string;
}

export function ResultMaping(map: DataMap) {

    return (target: any, key: string, descriptor) => {

        const method = descriptor.value;

        descriptor.value = async (...args) => {

            const type = <Klass> map.type;

            const results = <ResultMap[]> map.results;

            const ret = await method.apply(target, args);

            if (_.isEmpty(ret) || _.isEmpty(results)) {
                return;
            }

            const ins = new type();

            Object.keys(ret[0]).forEach(column => {
                const resultMap = results.find(item => item.column === column);

                if (resultMap) {
                    const property = resultMap.property ? resultMap.property : column;
                    ins[property] = ret[0][column];
                }

            });

            return ins;
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


