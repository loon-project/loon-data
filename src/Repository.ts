import {EventEmitter} from "events";
import {Klass} from "loon";
import {ActiveRecord} from "./ActiveRecord";
import {WhereOptions} from "./WhereOptions";
import * as _ from 'lodash';
import * as fp from 'lodash/fp';

export class Repository extends EventEmitter {

  private _where: WhereOptions;
  private _fields: string[];
  private _modelKlass: Klass;

  // private _client = client;
  private _and = this;
  private _single = {};
  private _statements: any[] = [];
  private _method = 'select';

  private _lastStatement: any;

  private _joinFlag = 'inner';
  private _boolFlag = 'and';
  private _notFlag = false;


  constructor(modelKlass: new (...args) => ActiveRecord ) {

    super();
    this._modelKlass = modelKlass;
  }

  public toString() {
    return this.toQuery();
  }

  public toQuery() {
  }

  public toSQL() {
  }

  public columns(...columns) {
    if (columns.length === 0) return this;
    this._statements.push({
      grouping: 'columns',
      value: columns
    });
    return this;
  }

  public distinct() {
    this._statements.push({
      grouping: 'columns',
      value: null,
      distinct: true
    });
    return this;
  }

  public where(query: string, ...bindings)

  /*
   * where chain support two ways
   *   1. object way .where({username: "Jack"})
   *   2. string way .where("username = ?", "Jack")
   */
  public where(options: WhereOptions) {

    const raw = "";

    this._statements.push({
      grouping: 'where',
      type: 'raw',
      value: raw,
      not: false,
      bool: false
    });
    return this;
  }

  public whereNot() {

  }

  public whereOr() {

  }

  public fields(...fields: string[]) {
    this._fields = fp.flow(
      fp.concat(),
      fp.flatten(),
      fp.uniq(),
      fp.compact()
    )(this._fields)(fields);

    return this;
  }

  public limit() {
    return this;
  }

  public order() {
    return this;
  }

  public count() {
    return this;
  }

  public find() {
    return this;
  }

  public findOne() {
    return this;
  }

  public update(data: any) {
    return this;
  }

  public delete() {
    return this;
  }

}

class User extends ActiveRecord {

}

const repo = new Repository(User);

