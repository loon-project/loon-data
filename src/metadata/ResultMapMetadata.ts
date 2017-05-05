
export class ResultMapMetadata {

    private _property: string;

    private _idAttribute: boolean;

    private _column: string;

    private _typeHandler: (...args) => any;


    get property(): string {
        return this._property;
    }

    set property(value: string) {
        this._property = value;
    }

    get idAttribute(): boolean {
        return this._idAttribute;
    }

    set idAttribute(value: boolean) {
        this._idAttribute = value;
    }

    get column(): string {
        return this._column;
    }

    set column(value: string) {
        this._column = value;
    }

    get typeHandler(): (...args) => any {
        return this._typeHandler;
    }

    set typeHandler(value: (...args) => any) {
        this._typeHandler = value;
    }
}