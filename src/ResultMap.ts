import {Result} from "./Result";

interface Klass {
    new (...args): any;
    name: string;
}


export function ResultsMap(result: Result) {

    return (target: any, key: string, descriptor) => {

        const method = descriptor.value;

        descriptor.value = async (...args) => {

            const type = <Klass> result.type;
            const results = result.results;

            const ret = await method.apply(target, args);

            if (Array.isArray(ret)) {

                return ret.map(item => {

                    const ins = new type();

                    Object.keys(item).forEach(column => {

                        let property = column;

                        if (results) {

                            const result = results.find(item => item.column === column);

                            if (result) {
                                property = result.property;
                            }
                        }

                        if (item.hasOwnProperty(column)) {
                            ins[property] = item[column];
                        }
                    });

                    return ins;
                });
            }
        };

    };
}
