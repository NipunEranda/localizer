export interface _Language {
  name: string;
  code: string;
  workspace: string;
  createdOn: Date;
  isDeleted: boolean;
  isActive: boolean;
}

export class Language {
  name: string;
  code: string;
  workspace: string;
  createdOn: Date;
  isDeleted: boolean;
  isActive: boolean;

  constructor(obj: _Language) {
    this.name = obj.name;
    this.code = obj.code;
    this.workspace = obj.workspace;
    this.createdOn = obj.createdOn ? obj.createdOn : new Date();
    this.isDeleted = obj.isDeleted != undefined ? obj.isDeleted : false;
    this.isActive = obj.isActive != undefined ? obj.isActive : true;
  }

  static createObject(obj: _Language) {
    return new Language(obj);
  }

  static createEmptyObject() {
    return new Language({
      name: "",
      code: "",
      workspace: "",
      createdOn: new Date(),
      isDeleted: false,
      isActive: true,
    });
  }
}
