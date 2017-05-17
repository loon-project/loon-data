import {DataMap} from "./DataMap";
import * as _ from 'lodash';
import {Klass, PropertyRegistry} from "loon";

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

        const type = <Klass> map.type;

        const properties = PropertyRegistry.properties.get(type);

        if (_.isUndefined(properties)) {
            return data;
        }

        if (!_.isArray(data)) {
            data = [data];
        }

        data.map(dataItem => {

        });


    }


}