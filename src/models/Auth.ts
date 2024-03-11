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
