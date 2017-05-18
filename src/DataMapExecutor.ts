import {DataMap} from "./DataMap";
import * as _ from "lodash";
import * as FP from "lodash/fp";
import {ConverterService, DependencyRegistry} from "loon";

export class DataMapExecutor {

    private cacheStore: Map<string, Function> = new Map();

    private converter = DependencyRegistry.get(ConverterService);

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

        const result = data.map(dataItem => {

            const mainIns = this.getIns(map, dataItem);

            if (map.associations) {
                map.associations.map(map => {

                    const ins = this.exec(dataItem, map, false);

                    if (ins && typeof ins.id !== 'undefined' && ins.id !== null) {
                        mainIns[map.property] = ins;
                    }
                });
            }

            if (map.collections) {
                 map.collections.map(map => {

                     const ins = this.exec(dataItem, map, false);

                     if (ins && typeof ins.id !== 'undefined' && ins.id !== null) {

                         if (mainIns[map.property]) {

                             if (mainIns[map.property].map(_ => _.id).indexOf(ins.id) === -1) {
                                 mainIns[map.property].push(ins);
                             }

                         } else {
                             mainIns[map.property] = [ins];
                         }
                     }
                });
            }

            return this.getCacheKey(map, dataItem);
        });

        const insList = FP.flow(
            FP.uniq,
            FP.map(cacheKey => this.cacheStore.get(<string> cacheKey)),
            FP.compact
        )(result);

        if (isCollection) {
            return insList;
        } else {
            return insList[0];
        }
    }

    private getIns(map: DataMap, data: any) {

        const cacheKey = this.getCacheKey(map, data);

        let ins = this.cacheStore.get(cacheKey);

        if (typeof ins === 'undefined') {
            ins = <Function> this.converter.convert(data, map.type, {prefix: map.prefix});
            this.cacheStore.set(cacheKey, ins);
        }

        return ins;
    }

    private getCacheKey(map: DataMap, data: any) {
        const idColumn = map.prefix ? `${map.prefix}id` : 'id';
        return `${idColumn}-${data[idColumn]}`;
    }
}
