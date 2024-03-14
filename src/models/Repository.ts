import { _User } from "./Auth";

export interface _Repository {
  id: Number;
  name: string;
  full_name: string;
  html_url: string;
  language: string;
  description: string;
  created_at: string;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  license: string;
  owner: _User;
  ownerLogin: string;
  private: boolean;
  visibility: string;
}
