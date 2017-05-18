import {DataMap} from "./DataMap";
import * as _ from "lodash";
import {ConverterService, DependencyRegistry, Klass} from "loon";

export class DataMapExecutor {

    public exec(data: any, map: DataMap, isCollection: boolean) {

        if (_.isUndefined(data) || _.isNull(data)) {
            return data;
        }

        if (_.isUndefined(map) || _.isNull(map)) {
            return data;
        }

        if (map && _.isUndefined(map.type)) {
            return data;
        }


        if (!_.isArray(data)) {
            data = [data];
        }

        const mainCache: Map<number, Function> = new Map();
        const associationCache: Map<string, Function> = new Map();
        const collectionCache: Map<string, Function> = new Map();

        data.map(dataItem => {

            const mainId = this.getId(map, dataItem);

            const mainIns = this.getIns(mainId, mainCache, dataItem, map);

            if (map.associations) {
                map.associations.map(map => {

                    const id = this.getId(map, dataItem);
                    const cacheKey = this.cacheKey(map.property, id);
                    const ins = this.getIns(cacheKey, associationCache, dataItem, map);

                    if (ins) {
                        mainIns[map.property] = ins;
                    }
                });
            }

            if (map.collections) {
                 map.collections.map(map => {

                     const id = this.getId(map, dataItem);
                     const cacheKey = this.cacheKey(map.property, id);
                     const ins = this.getIns(cacheKey, collectionCache, dataItem, map);

                     if (ins) {
                         if (mainIns[map.property]) {
                             mainIns[map.property].push(ins);
                         } else {
                             mainIns[map.property] = [ins];
                         }
                     }
                });
            }
        });

        const dataArr = _.flatten(Array.from(mainCache)).filter((_, i) => i % 2 === 1);

        if (isCollection) {
            return dataArr;
        } else {
            return dataArr[0];
        }
    }

    private getId(map: DataMap, data: any) {
        return map.prefix ? data[`${map.prefix}id`] : data['id'];
    }

    private cacheKey(property: string, id: number) {
        if (typeof id === 'undefined' || id === null) {
            return;
        }
        return `${property}-${id}`;
    }

    private getIns(cacheKey, cacheStore, data, map) {

        const type = <Klass> map.type;

        let ins = cacheStore.get(cacheKey);
        const converter = DependencyRegistry.get(ConverterService);

        if (typeof cacheKey === 'undefined') {
            return;
        }

        if (typeof ins === 'undefined') {
            ins = converter.convert(data, type, {prefix: map.prefix});
            cacheStore.set(cacheKey, ins);
        }

        return ins;
    }
}
