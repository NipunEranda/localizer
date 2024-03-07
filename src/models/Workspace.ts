export interface _Workspace {
  name: string;
  deleted: boolean;
  isActive: boolean;
}

export class Workspace {
  name: string;
  deleted: boolean;
  isActive: boolean;

  constructor(obj: _Workspace) {
    this.name = obj.name;
    this.deleted = obj.deleted;
    this.isActive = obj.isActive;
  }
}
