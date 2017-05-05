import {AssociationMapMetadata} from "./AssociationMapMetadata";
import {CollectionMapMetadata} from "./CollectionMapMetadata";
import {ResultMapMetadata} from "./ResultMapMetadata";

export class DataMapMetadata {

    protected _type: Function;

    protected _associations: Map<string, AssociationMapMetadata> = new Map();

    protected _collections: Map<string, CollectionMapMetadata> = new Map();

    protected _results: Map<string, ResultMapMetadata> = new Map();


    get type(): Function {
        return this._type;
    }

    set type(value: Function) {
        this._type = value;
    }

    get associations(): Map<string, AssociationMapMetadata> {
        return this._associations;
    }

    set associations(value: Map<string, AssociationMapMetadata>) {
        this._associations = value;
    }

    get collections(): Map<string, CollectionMapMetadata> {
        return this._collections;
    }

    set collections(value: Map<string, CollectionMapMetadata>) {
        this._collections = value;
    }


    get results(): Map<string, ResultMapMetadata> {
        return this._results;
    }

    set results(value: Map<string, ResultMapMetadata>) {
        this._results = value;
    }
}
