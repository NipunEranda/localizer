import { _User } from "./Auth";
import { _Workspace } from "./Workspace";

export interface _File {
  name: string;
  repository: number;
  fileUrl: string;
  branch: string | number;
  versionId: number | null;
  type: string;
  from: string;
  to: string;
  owner: string;
  workspace: string;
  createdOn: Date;
  modifiedOn: Date;
  modifiedBy: string;
  history: Array<string>;
}

export class File implements _File {
  name: string;
  repository: number;
  fileUrl: string;
  branch: string | number;
  versionId: number | null;
  type: string;
  from: string;
  to: string;
  owner: string;
  workspace: string;
  createdOn: Date;
  modifiedOn: Date;
  modifiedBy: string;
  history: Array<string>;

  constructor(
    name: string,
    repository: number,
    fileUrl: string,
    branch: string | number,
    versionId: number | null,
    type: string,
    from: string,
    to: string,
    owner: string,
    workspace: string,
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
    this.workspace = workspace;
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
      obj.workspace,
      obj.createdOn
    );
  }

  static createEmptyObject(owner: string, workspace: string) {
    return new File(
      "",
      0,
      "",
      0,
      null,
      "",
      "",
      "",
      owner,
      workspace,
      new Date()
    );
  }
}
