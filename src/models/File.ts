import { _User } from "./Auth";

export interface _File {
  name: string;
  repository: number;
  fileUrl: string;
  branch: number;
  versionId: number | null;
  type: string;
  from: string;
  to: string;
  owner: _User | null;
  createdOn: Date;
  modifiedOn: Date;
  modifiedBy: _User | null;
  history: Array<string>;
}

export class File implements _File {
  name: string;
  repository: number;
  fileUrl: string;
  branch: number;
  versionId: number | null;
  type: string;
  from: string;
  to: string;
  owner: _User | null;
  createdOn: Date;
  modifiedOn: Date;
  modifiedBy: _User | null;
  history: Array<string>;

  constructor(
    name: string,
    repository: number,
    fileUrl: string,
    branch: number,
    versionId: number | null,
    type: string,
    from: string,
    to: string,
    owner: _User | null = null,
    createdOn: Date = new Date()
  ) {
    this.name = name;
    this.repository = repository;
    this.fileUrl = fileUrl;
    this.branch = branch;
    this.versionId = versionId;
    this.type = type;
    this.from = from;
    this.to = to;
    this.owner = owner;
    this.createdOn = createdOn;
    this.modifiedOn = createdOn;
    this.modifiedBy = owner;
    this.history = [];
  }

  static createObject(obj: _File) {
    return new File(
      obj.name,
      obj.repository,
      obj.fileUrl,
      obj.branch,
      obj.versionId,
      obj.type,
      obj.from,
      obj.to,
      obj.owner,
      obj.createdOn
    );
  }

  static createEmptyObject() {
    return new File("", 0, "", 0, null, "", "", "", null, new Date());
  }
}
