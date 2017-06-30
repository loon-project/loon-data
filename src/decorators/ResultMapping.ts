import {DataMap} from "../DataMap";
import {DataMapExecutor} from "../DataMapExecutor";


export function ResultMapping(map: DataMap) {

    return (target: any, key: string, descriptor) => {

        const method = descriptor.value;

        descriptor.value = (...args) => {
            const executor = new DataMapExecutor();

            const result = method.apply(target, args);

            if (result && result.then && typeof result.then === 'function') {
                return result
                    .then(result => executor.exec(result, map, false))
                    .catch(e => {throw e});
            }

            return executor.exec(result, map, false);
        };
    };
}

export function ResultsMapping(map: DataMap) {

    return (target: any, key: string, descriptor) => {

        const method = descriptor.value;

        descriptor.value = (...args) => {

            const executor = new DataMapExecutor();

            const result = method.apply(target, args);

            if (result && result.then && typeof result.then === 'function') {
                return result
                    .then(result => executor.exec(result, map, true))
                    .catch(e => {throw e});
            }

            return executor.exec(result, map, true);
        };

    };
}


