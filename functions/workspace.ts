import middy from "middy";
import {
  AppResponse,
  _Response,
  closeMongooseConnection,
  connectMongoose,
} from "./util";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { verifyToken } from "./auth";
import { _User, userSchema } from "./services/github";
import mongoose, { ObjectId } from "mongoose";

interface _Workspace {
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

const WorkspaceSchema = new mongoose.Schema({
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

export const getWorkspaces = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    connectMongoose();
    // Get user workspace list
    let user = await userSchema.findOne({
      _id: event.queryStringParameters?.userId,
    });

    let newWorkspaceList: string[] = [];
    user?.workspaces.map((w) => newWorkspaceList.push(w));

    // Get user workspaces
    const workspaces = await workspaceSchema.find({
      _id: { $in: newWorkspaceList },
      isActive: true,
    });

    return AppResponse.createObject(200, workspaces, "Workspace Loaded!");
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    closeMongooseConnection();
  }
};

export const addWorkspace = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    connectMongoose();
    if (event.body) {
      const workspace: _Workspace = JSON.parse(event.body);

      // Get User
      let user = await userSchema.findOne({
        _id: event.queryStringParameters?.userId,
      });

      // Insert workspaces
      const insertedWorkspace = await workspaceSchema.create(workspace);

      user?.workspaces.push(insertedWorkspace._id.toString());
      // Update user workspaces
      await userSchema.updateOne(
        { _id: user?._id },
        { $set: { workspaces: user?.workspaces } }
      );

      let newWorkspaceList: string[] = [];
      user?.workspaces.map((w) => newWorkspaceList.push(w));

      // Get user workspaces
      const workspaces = await workspaceSchema.find({
        _id: { $in: newWorkspaceList },
        isActive: true,
      });
      return AppResponse.createObject(200, workspaces, "Workspace Added!");
    } else {
      return AppResponse.createObject(400, null, "Mongo db connection failed!");
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    closeMongooseConnection();
  }
};

export const deleteWorkspace = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    connectMongoose();
    const workspaceId = event.queryStringParameters?.id;
    if (workspaceId) {
      // Get User
      let user = await userSchema.findOne({
        _id: event.queryStringParameters?.userId,
      });

      // Update workspace
      await workspaceSchema.updateOne(
        { _id: workspaceId },
        { $set: { deleted: true, isActive: false } }
      );

      let newWorkspaceList: string[] = [];
      user?.workspaces.map((w) => newWorkspaceList.push(w));

      // Get user workspaces
      const workspaces = await workspaceSchema.find({
        _id: { $in: newWorkspaceList },
        isActive: true,
      });

      return AppResponse.createObject(200, workspaces, "Workspace Removed!");
    } else {
      return AppResponse.createObject(
        400,
        null,
        "Please provide the workspace Id."
      );
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    closeMongooseConnection();
  }
};

export const responseHandler = async function (
  event: APIGatewayProxyEvent,
  context: Context
) {
  try {
    let result: AppResponse | null;
    if (
      event.path == `${process.env.VUE_APP_API_URL}/workspace` &&
      event.httpMethod == "POST"
    ) {
      result = await addWorkspace(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/workspace` &&
      event.httpMethod == "GET"
    ) {
      result = await getWorkspaces(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/workspace` &&
      event.httpMethod == "DELETE"
    ) {
      result = await deleteWorkspace(event);
    } else {
      return AppResponse.createObject(404, null, "Path doesn't exists");
    }
    if (result) return result;
    else {
      return AppResponse.createObject(
        500,
        null,
        "Unable to response to request!"
      );
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(e.statusCode, e, e.message);
  }
};

export const handler = middy(responseHandler).use(verifyToken());
