import { _User } from "./Auth";
import { _Workspace } from "./Workspace";

export interface _translation {
  language: string;
  value: string;
}

export interface _FileLine {
  name: string;
  value: string;
  new: boolean;
  translation: _translation;
  history: _translation[];
}

export interface _File {
  _id: string;
  name: string;
  repository: string;
  fileUrl: string;
  branch: string;
  versionId: number | null;
  type: string;
  from: string;
  to: string;
  lines: _FileLine[];
  owner: string;
  workspace: string;
  createdOn: Date;
  modifiedOn: Date;
  modifiedBy: string;
  deleted: boolean;
  history: Array<string>;
}

export class File implements _File {
  _id: string;
  name: string;
  repository: string;
  fileUrl: string;
  branch: string;
  versionId: number | null;
  type: string;
  from: string;
  to: string;
  lines: _FileLine[];
  owner: string;
  workspace: string;
  createdOn: Date;
  modifiedOn: Date;
  modifiedBy: string;
  deleted: boolean;
  history: Array<string>;

  constructor(
    _id: string,
    name: string,
    repository: string,
    fileUrl: string,
    branch: string,
    versionId: number | null,
    type: string,
    from: string,
    to: string,
    lines: _FileLine[],
    owner: string,
    workspace: string,
    createdOn: Date = new Date(),
    deleted: boolean
  ) {
    this._id = _id;
    this.name = name;
    this.repository = repository;
    this.fileUrl = fileUrl;
    this.branch = branch;
    this.versionId = versionId;
    this.type = type;
    this.from = from;
    this.to = to;
    this.lines = lines;
    this.owner = owner;
    this.workspace = workspace;
    this.createdOn = createdOn;
    this.modifiedOn = createdOn;
    this.modifiedBy = owner;
    this.deleted = deleted;
    this.history = [];
  }

  static createObject(obj: _File) {
    return new File(
      obj._id,
      obj.name,
      obj.repository,
      obj.fileUrl,
      obj.branch,
      obj.versionId,
      obj.type,
      obj.from,
      obj.to,
      obj.lines,
      obj.owner,
      obj.workspace,
      obj.createdOn,
      obj.deleted
    );
  }

  static createEmptyObject(owner: string, workspace: string) {
    return new File(
      "",
      "",
      "",
      "",
      "",
      null,
      "",
      "",
      "",
      [],
      owner,
      workspace,
      new Date(),
      false
    );
  }
}
