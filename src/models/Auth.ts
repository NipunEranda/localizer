// Interfaces
export interface _User {
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

  constructor(obj: _User) {
    this.avatar_url = obj.avatar_url;
    this.bio = obj.bio;
    this.company = obj.company;
    this.created_at = obj.created_at;
    this.email = obj.created_at;
    this.followers = obj.followers;
    this.following = obj.following;
    this.html_url = obj.html_url;
    this.id = obj.id;
    this.location = obj.location;
    this.login = obj.login;
    this.name = obj.name;
    this.public_repos = obj.public_repos;
    this.type = obj.type;
  }
}
