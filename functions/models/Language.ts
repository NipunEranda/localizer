import mongoose, { Mongoose, ObjectId } from "mongoose";

export interface _Language {
  _id: string,
  name: string;
  code: string;
  workspace: string;
  createdOn: Date;
  isDeleted: boolean;
  isActive: boolean;
}

export interface LanguageDocument extends _Language, mongoose.Document {
  _id: string;
  name: string;
  code: string;
  workspace: string;
  createdOn: Date;
  isDeleted: boolean;
  isActive: boolean;
}

export const LanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  code: {
    type: String,
    required: true,
    unique: false,
  },
  workspace: {
    type: String,
    requried: true,
    unique: false,
  },
  createdOn: {
    type: Date,
    required: true,
    unique: false,
  },
  isDeleted: {
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

// Create Language schema
export const languageSchema = mongoose.model<_Language>(
  "language",
  LanguageSchema
);
