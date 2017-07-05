import "../TestHelper";
import {expect} from 'chai';
import mysql from '../../src/adapters/mysql';
import {ActiveRecord} from "../../src/ActiveRecord";
import {Table} from "../../src/decorators/Table";
import {Column} from "../../src/decorators/Column";
import {Repository} from "../../src/Repository";

@Table('members')
class Member extends ActiveRecord {

  @Column()
  public username: string;

  @Column()
  public email: string;

  @Column('created_at')
  public createdAt: Date;
}

describe('Query integration test', () => {

  it('should return table information', async () => {

    const member = new Member();

    member.username = "aaa";
    member.email = "aaa@gmail.com";

    await member.save();

    const userRepo = new Repository(Member);
    const user: Member = await userRepo.where("Member.username = ?", "").limit(1);

    expect(user instanceof Member).to.be.true;
  });
});
