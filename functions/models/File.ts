import mongoose, { ObjectId } from "mongoose";

export interface _File {
  _id: string;
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
  deleted: boolean;
}

export interface FileDocument extends _File, mongoose.Document {
  _id: string;
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
  deleted: boolean;
}

export const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  repository: {
    type: Number,
    require: true,
    unique: false,
  },
  fileUrl: {
    type: String,
    require: true,
    unique: false,
  },
  branch: {
    type: String || Number,
    require: true,
    unique: false,
  },
  versionId: {
    type: String,
    require: false,
    unique: false,
  },
  type: {
    type: String,
    require: true,
    unique: false,
  },
  from: {
    type: String,
    require: true,
    unique: false,
  },
  to: {
    type: String,
    require: true,
    unique: false,
  },
  owner: {
    type: String,
    require: true,
    unique: false,
  },
  workspace: {
    type: String,
    require: true,
    unique: false,
  },
  createdOn: {
    type: Date,
    require: true,
    unique: false,
  },
  modifiedOn: {
    type: Date,
    require: true,
    unique: false,
  },
  modifiedBy: {
    type: String,
    require: true,
    unique: false,
  },
  history: {
    type: Array,
    require: false,
    unique: false,
  },
  deleted: {
    type: Boolean,
    require: false,
    unique: false,
    default: false
  }
});

// Create Workspace schema
export const fileSchema = mongoose.model<_File>("File", FileSchema);
