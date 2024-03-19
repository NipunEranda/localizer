// Interfaces
export interface _User {
  _id: string;
  avatar_url: string;
  bio: string;
  company: string;
  created_at: string;
  email: string;
  followers: number;
  following: number;
  html_url: string;
  id: number;
  location: string;
  login: string;
  name: string;
  public_repos: number;
  type: string;
  workspaces: string[];
}

export interface _Login {
  token: string;
  user: _User;
}

// Classes
export class Login {
  token: string;
  user: _User;

  constructor(obj: _Login) {
    this.token = obj.token;
    this.user = obj.user;
  }
}

export class User {
  _id: string;
  avatar_url: string;
  bio: string;
  company: string;
  created_at: string;
  email: string;
  followers: number;
  following: number;
  html_url: string;
  id: number;
  location: string;
  login: string;
  name: string;
  public_repos: number;
  type: string;
  workspaces: string[];

  constructor(
    _id: string,
    avatar_url: string,
    bio: string,
    company: string,
    created_at: string,
    email: string,
    followers: number,
    following: number,
    html_url: string,
    id: number,
    location: string,
    login: string,
    name: string,
    public_repos: number,
    type: string,
    workspaces: string[]
  ) {
    this._id = _id;
    this.avatar_url = avatar_url;
    this.bio = bio;
    this.company = company;
    this.created_at = created_at;
    this.email = email;
    this.followers = followers;
    this.following = following;
    this.html_url = html_url;
    this.id = id;
    this.location = location;
    this.login = login;
    this.name = name;
    this.public_repos = public_repos;
    this.type = type;
    this.workspaces = workspaces;
  }

  static createObject(obj: _User) {
    return new User(
      obj._id,
      obj.avatar_url,
      obj.bio,
      obj.company,
      obj.created_at,
      obj.email,
      obj.followers,
      obj.following,
      obj.html_url,
      obj.id,
      obj.location,
      obj.login,
      obj.name,
      obj.public_repos,
      obj.type,
      obj.workspaces
    );
  }

  static createEmptyObject() {
    return new User(
      "",
      "",
      "",
      "",
      "",
      "",
      0,
      0,
      "",
      0,
      "",
      "",
      "",
      0,
      ",",
      []
    );
  }
}
