import {EventEmitter} from "events";
import {ActiveRecord} from "./ActiveRecord";
import {SchemaRegistry} from "./SchemaRegistry";
import {ConverterService} from "loon";
import {Adapter} from "./Adapter";

export class Repository extends EventEmitter {

  private _modelKlass: Function;

  private _knexQuery;

  private _converter: ConverterService;

  private _knex;

  constructor(modelKlass: new (...args) => ActiveRecord) {

    super();

    const tableName = SchemaRegistry.getTableName(this._modelKlass);

    this._modelKlass = modelKlass;
    this._knex = Adapter.getConnection();
    this._converter = new ConverterService();

    if (tableName) {
      this._knexQuery = this._knex.from(tableName);
    } else {
      throw new Error(`${this._modelKlass.name} haven't register with @Table`)
    }
  }

  public timeout(ms: number) {
    this._knexQuery = this._knexQuery.timeout(ms);
    return this;
  }

  public select(...args: string[]) {
    this._knexQuery = this._knexQuery.select(...args);
    return this;
  }

  public as(name: string) {
    this._knexQuery = this._knexQuery.as(name);
    return this;
  }

  public where(...args: any[]) {
    this._knexQuery = this._knexQuery.where(...args);
    return this;
  }

  public whereNot(...args: any[]) {
    this._knexQuery = this._knexQuery.whereNot(...args);
    return this;
  }

  public whereIn(column: string, option: any) {
    this._knexQuery = this._knexQuery.whereIn(column, option);
    return this;
  }

  public orWhereIn(column: string, option: any) {
    this._knexQuery = this._knexQuery.orWhereIn(column, option);
    return this;
  }

  public whereNotIn(column: string, option: any) {
    this._knexQuery = this._knexQuery.whereNotIn(column, option);
    return this;
  }

  public orWhereNotIn(column: string, option: any) {
    this._knexQuery = this._knexQuery.orWhereNotIn(column, option);
    return this;
  }

  public whereNull(column: string) {
    this._knexQuery = this._knexQuery.whereNull(column);
    return this;
  }

  public OrWhereNull(column: string) {
    this._knexQuery = this._knexQuery.OrWhereNull(column);
    return this;
  }

  public whereNotNull(column: string) {
    this._knexQuery = this._knexQuery.whereNotNull(column);
    return this;
  }

  public OrWhereNotNull(column: string) {
    this._knexQuery = this._knexQuery.OrWhereNotNull(column);
    return this;
  }

  public whereExists(option) {
    this._knexQuery = this._knexQuery.whereExists(option);
    return this;
  }

  public orWhereNotExists(option) {
    this._knexQuery = this._knexQuery.orWhereNotExists(option);
    return this;
  }

  public whereBetween(column: string, range: string[]|number[]) {
    this._knexQuery = this._knexQuery.whereBetween(column, range);
    return this;
  }

  public orWhereBetween(column: string, range: string[]|number[]) {
    this._knexQuery = this._knexQuery.orWhereBetween(column, range);
    return this;
  }

  public whereNotBetween(column: string, range: string[]|number[]) {
    this._knexQuery = this._knexQuery.whereNotBetween(column, range);
    return this;
  }

  public orWhereNotBetween(column: string, range: string[]|number[]) {
    this._knexQuery = this._knexQuery.orWhereNotBetween(column, range);
    return this;
  }

  public whereRaw(query, binding?: any[]) {
    this._knexQuery = this._knexQuery.whereRaw(query, binding);
    return this;
  }

  public transacting(transactionObj: any) {
    this._knexQuery = this._knexQuery.transacting(transactionObj);
    return this;
  }



  public distinct(...args: string[]) {
    this._knexQuery = this._knexQuery.distinct(...args);
    return this;
  }

  public orderBy(...args: string[]) {
    this._knexQuery = this._knexQuery.orderBy(...args);
    return this;
  }

  public orderByRaw(sql: any) {
    this._knexQuery = this._knexQuery.orderByRaw(sql);
    return this;
  }

  public offset(value: number) {
    this._knexQuery = this._knexQuery.offset(value);
    return this;
  }

  public limit(value: number) {
    this._knexQuery = this._knexQuery.limit(value);
    return this;
  }

  public async then() {
    const result = await this._knexQuery;
    return this._converter.convert(result, this._modelKlass);
  }
}


