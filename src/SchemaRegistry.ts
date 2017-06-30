import {Klass} from "loon";
import {TableMetadata} from "./TableMetadata";

export class SchemaRegistry {

  private static _tables: Map<Function, TableMetadata> = new Map();

  public static registerTable(type: Function, tableName?: string) {
    tableName = tableName ? tableName : type.name;

    const tableMetadata = this.findOrBuildTableMetadata(type);
    tableMetadata.tableName = tableName;
  }

  public static registerColumn(type: Function, propertyName: string, columnName?: string) {
    columnName = columnName ? columnName : propertyName;

    const tableMetadata = this.findOrBuildTableMetadata(type);
  }

  private static findOrBuildTableMetadata(type: Function) {
    let tableMetadata = this._tables.get(type);

    if (typeof tableMetadata === 'undefined') {
      tableMetadata = new TableMetadata();
      tableMetadata.type = type;
    }

    return tableMetadata;
  }

}