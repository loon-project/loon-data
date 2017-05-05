import {DataMapMetadata} from "./DataMapMetadata";

export class AssociationMapMetadata extends DataMapMetadata {

    private _property: string;

    get property(): string {
        return this._property;
    }

    set property(value: string) {
        this._property = value;
    }
}