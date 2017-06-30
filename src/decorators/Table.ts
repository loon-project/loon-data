import {SchemaRegistry} from "../SchemaRegistry";

export function Table(tableName?: string) {
  return (target: any) => {
    SchemaRegistry.registerTable(target, tableName);
  }
}