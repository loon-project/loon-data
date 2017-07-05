
export class Adapter {

  private static _knex;

  public static init(knex) {
    this._knex = knex;
  }

  public static getConnection() {

    if (typeof this._knex === 'undefined') {
      throw new Error('initialize first with Adapter.init() method')
    }

    return this._knex;
  }
}