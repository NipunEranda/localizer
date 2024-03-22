export interface _Workspace {
  _id: string;
  name: string;
  deleted: boolean;
  isActive: boolean;
}

export class Workspace {
  _id: string;
  name: string;
  deleted: boolean;
  isActive: boolean;

  constructor(_id: string, name: string, deleted: boolean, isActive: boolean) {
    this._id = _id;
    this.name = name;
    this.deleted = deleted;
    this.isActive = isActive;
  }

  static createObject(obj: _Workspace) {
    return new Workspace(obj._id, obj.name, obj.deleted, obj.isActive);
  }

  static createEmptyObject() {
    return new Workspace("", "", false, true);
  }
}
