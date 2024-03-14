import mongoose, { ObjectId } from "mongoose";

export interface _Workspace {
  _id: ObjectId;
  name: string;
  deleted: boolean;
  isActive: boolean;
}

export interface WorkspaceDocument extends _Workspace, mongoose.Document {
  _id: ObjectId;
  name: string;
  deleted: boolean;
  isActive: boolean;
}

export const WorkspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  deleted: {
    type: Boolean,
    required: true,
    unique: false,
  },
  isActive: {
    type: Boolean,
    required: true,
    unique: false,
  },
});

// Create Workspace schema
export const workspaceSchema = mongoose.model<_Workspace>(
  "Workspace",
  WorkspaceSchema
);
