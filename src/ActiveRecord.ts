import {EventEmitter} from "events";
import {ConverterService} from "loon";
import {SchemaRegistry} from "./SchemaRegistry";

export class ActiveRecord extends EventEmitter {

  private converterService = new ConverterService();

  private knex = require('knex')({
  });

  constructor() {
    super();

  }

  public timeout() {
  }

  public static findOne(id: number) {
  }

  public static findOneBy(fields: any) {
  }

  public static where() {

    return this;
  }

  public static select() {
  }


  public async save() {
    const obj = this.converterService.convert(this, Object);
    const type = this.constructor;

    const tableName = SchemaRegistry.getTableName(type);

    if (tableName) {
      this.knex.from(tableName).insert(obj);
    } else {
      throw new Error(`${type.name} haven't register with @Table`)
    }
  }
}

