import {WhereOptions} from "./WhereOptions";
import {ActiveRecord} from "./ActiveRecord";
import * as _ from 'lodash';
import * as fp from 'lodash/fp';

export class QueryBuilder {

  private _where: WhereOptions;
  private _fields: string[];

  constructor(model: ActiveRecord) {
  }

  public toSQL() {

  }

  public where(options: WhereOptions) {
    this._where = _.merge({}, this._where, options);
    return this;
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