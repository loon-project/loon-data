import {AssociationMap, CollectionMap, DataMap, ResultMap} from "./DataMap";
import {DataMapMetadata} from "./metadata/DataMapMetadata";
import * as _ from 'lodash';
import {AssociationMapMetadata} from "./metadata/AssociationMapMetadata";
import {ResultMapMetadata} from "./metadata/ResultMapMetadata";
import {CollectionMapMetadata} from "./metadata/CollectionMapMetadata";




/**
 * Use DataMapParser to parse DataMap
 */
export class DataMapParser {

    private _map: DataMap;

    constructor(map: DataMap) {
        this._map = map;
        this.parse(this._map, true);
    }

    public parse(map: DataMap, root: boolean): DataMapMetadata {

        const metadata = new DataMapMetadata();

        if (root && _.isEmpty(map.type)) {
            throw new Error('must specify a type for root DataMap');
        }

        metadata.type = <Function> map.type;


        if (map.results) {
            metadata.results = this.parseResultsMap(map.results);
        }

        if (map.associations) {
            metadata.associations = this.parseAssociationMap(map.associations);
        }

        if (map.collections) {
            metadata.collections = this.parseCollectionMap(map.collections);
        }

        return metadata;
    }

    private parseResultsMap(results: ResultMap[]): Map<string, ResultMapMetadata> {

        const map = new Map();

        results.forEach(result => {
            const metadata = new ResultMapMetadata();

            metadata.property = result.property;

            if (!_.isUndefined(result.idAttribute)) {
                metadata.idAttribute = result.idAttribute;
            }

            if (!_.isUndefined(result.column)) {
                metadata.column = result.column;
            }

            if (!_.isUndefined(result.typeHandler)) {
                metadata.typeHandler = result.typeHandler;
            }

            map.set(result.property, metadata)
        });

        return map;
    }

    private parseAssociationMap(associations: AssociationMap[]): Map<string, AssociationMapMetadata> {

        const map = new Map();

        associations.forEach((association: AssociationMap) => {

            const metadata = new AssociationMapMetadata();

            map.set(association.property, metadata);
        });

        return map;
    }

    private parseCollectionMap(collections: CollectionMap[]) {

        const map = new Map();

        collections.forEach(collection => {

            const metadata = new CollectionMapMetadata();

            map.set(collection.property, metadata);
        });

        return map;
    }

}
