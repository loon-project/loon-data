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

                    mainIns[map.property] = ins;
                });
            }

            if (map.collections) {
                 map.collections.map(map => {

                     const id = this.getId(map, dataItem);
                     const cacheKey = this.cacheKey(map.property, id);
                     const ins = this.getIns(cacheKey, collectionCache, dataItem, map);

                     if (mainIns[map.property]) {

                         for (let i = 0; i < mainIns[map.property].length; i++) {
                             if (mainIns[map.property][i].id === ins.id) {
                                 return;
                             }
                         }

                         return mainIns[map.property].push(ins);

                     } else {
                         mainIns[map.property] = [ins];
                     }
                });
            }
        });

        if (isCollection) {
            return Array.from(mainCache.entries())
        } else {
            if (mainCache.size > 0) {
                return mainCache.entries().next().value
            }
        }
    }

    private getId(map: DataMap, data: any) {
        return map.prefix ? data[`${map.prefix}id`] : data['id'];
    }

    private cacheKey(property: string, id: number) {
        return `${property}-${id}`;
    }

    private getIns(cacheKey, cacheStore, data, map) {

        const type = <Klass> map.type;

        let ins = cacheStore.get(cacheKey);

        if (typeof ins === 'undefined') {

            const converter = DependencyRegistry.get(ConverterService);
            ins = converter.convert(data, type, {prefix: map.prefix});
            cacheStore.set(cacheKey, ins);
        }

        return ins;
    }



}