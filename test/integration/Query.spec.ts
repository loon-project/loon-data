import "../TestHelper";
import {expect} from 'chai';
import mysql from '../../src/adapters/mysql';
import {ActiveRecord} from "../../src/ActiveRecord";
import {Table} from "../../src/decorators/Table";
import {Column} from "../../src/decorators/Column";

@Table('members')
class Member extends ActiveRecord {

  @Column()
  public username: string;

  @Column()
  public email: string;

}

describe('Query integration test', () => {

  it('should return table information', async () => {

  });

});
