import { _User } from "./Auth";

export interface _File {
  name: string;
  repository: number;
  fileUrl: string;
  branch: string;
  versionId: number;
  type: string;
  from: string;
  to: string;
  owner: _User;
  createdOn: Date;
  modifiedOn: Date;
  modifiedBy: _User;
  history: Array<string>;
}
