import {DataMap, ResultMap} from "./DataMap";
import * as _ from 'lodash';

interface Klass {
    new (...args): any;
    name: string;
}

export function ResultMap(map: DataMap) {
}

export function ResultsMap(result: DataMap) {

    return (target: any, key: string, descriptor) => {

        const method = descriptor.value;

        descriptor.value = async (...args) => {

            const type = <Klass> result.type;
            const results = result.results;

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
