import {SchemaRegistry} from "../SchemaRegistry";

export function Column(columnName?: string) {

  return (target: any, property: string) => {
    SchemaRegistry.registerColumn(target.constructor, property, columnName);
  }

}
