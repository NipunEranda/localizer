import { _User } from "./Auth";

export interface _Repository {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  language: string;
  description: string;
  created_at: Date;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  license: string;
  owner: _User | null;
  ownerLogin: string;
  private: boolean;
  visibility: string;
  branches: _Branch[];
}

export class Repository {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  language: string;
  description: string;
  created_at: Date;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  license: string;
  owner: _User | null;
  ownerLogin: string;
  private: boolean;
  visibility: string;
  branches: _Branch[];

  constructor(
    id: string,
    name: string,
    full_name: string,
    html_url: string,
    language: string,
    description: string,
    created_at: Date,
    default_branch: string,
    archived: boolean,
    disabled: boolean,
    license: string,
    owner: _User | null,
    ownerLogin: string,
    isPrivate: boolean,
    visibility: string,
    branches: _Branch[]
  ) {
    this.id = id;
    this.name = name;
    this.full_name = full_name;
    this.html_url = html_url;
    this.language = language;
    this.description = description;
    this.created_at = created_at;
    this.default_branch = default_branch;
    this.archived = archived;
    this.disabled = disabled;
    this.license = license;
    this.owner = owner;
    this.ownerLogin = ownerLogin;
    this.private = isPrivate;
    this.visibility = visibility;
    this.branches = branches;
  }

  static createObject(obj: _Repository) {
    return new Repository(
      obj.id,
      obj.name,
      obj.full_name,
      obj.html_url,
      obj.language,
      obj.description,
      obj.created_at,
      obj.default_branch,
      obj.archived,
      obj.disabled,
      obj.license,
      obj.owner,
      obj.ownerLogin,
      obj.private,
      obj.visibility,
      obj.branches
    );
  }

  static createEmptyObject() {
    return new Repository(
      "",
      "",
      "",
      "",
      "",
      "",
      new Date(),
      "",
      false,
      false,
      "",
      null,
      "",
      false,
      "",
      []
    );
  }
}

export interface _Branch {
  name: string;
  commit: [];
  protected: boolean;
}
