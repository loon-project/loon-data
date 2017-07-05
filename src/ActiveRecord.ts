import {EventEmitter} from "events";
import {ConverterService} from "loon";
import {SchemaRegistry} from "./SchemaRegistry";
import {Adapter} from "./Adapter";

export class ActiveRecord extends EventEmitter {

  protected id: number;

  private _converterService = new ConverterService();
  private _knex = Adapter.getConnection();

  constructor() {
    super();
  }

  public static tableName() {
    return SchemaRegistry.getTableName(this);
  }

  public async save() {
    const obj = this._converterService.convert(this, Object);
    const type = this.constructor;
    const tableName = SchemaRegistry.getTableName(type);

    if (tableName) {
      this._knex.from(tableName).insert(obj);
    } else {
      throw new Error(`${type.name} haven't register with @Table`)
    }
  }

  public delete() {
    const type = this.constructor;
    const tableName = SchemaRegistry.getTableName(type);
    return this._knex.from(tableName).where('id', this.id).delete();
  }
}

