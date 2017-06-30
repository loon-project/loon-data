import {EventEmitter} from "events";

export class ActiveRecord extends EventEmitter {

  constructor() {
    super();
  }

  public static async findOne(id: number) {
  }

  public static async findOneBy(fields: any) {
  }

  public static async create(fields: any) {
  }

  public async save() {
  }

  public update() {
  }

}