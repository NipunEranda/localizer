import mongoose, { ObjectId } from "mongoose";

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
  
  export interface UserDocument extends _User, mongoose.Document {
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
  
  const UserSchema = new mongoose.Schema({
    avatar_url: {
      type: String,
      required: false,
      unique: false,
    },
    bio: {
      type: String,
      required: false,
      unique: false,
    },
    company: {
      type: String,
      required: false,
      unique: false,
    },
    created_at: {
      type: String,
      required: false,
      unique: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    followers: {
      type: Number,
      required: false,
      unique: false,
    },
    following: {
      type: Number,
      required: false,
      unique: false,
    },
    html_url: {
      type: String,
      required: false,
      unique: false,
    },
    id: {
      type: Number,
      required: false,
      unique: false,
    },
    location: {
      type: String,
      required: false,
      unique: false,
    },
    login: {
      type: String,
      required: false,
      unique: false,
    },
    name: {
      type: String,
      required: false,
      unique: false,
    },
    public_repos: {
      type: Number,
      required: false,
      unique: false,
    },
    type: {
      type: String,
      required: false,
      unique: false,
    },
    workspaces: {
      type: Array,
      required: false,
      unique: false,
    },
  });
  
  UserSchema.index({ id: 1 });
  
  // Create github user schema
  export const userSchema = mongoose.model<_User>("user", UserSchema);