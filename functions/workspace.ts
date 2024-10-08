import middy from "middy";
import {
  AppResponse,
  _Response,
  connectMongoose,
  closeMongooseConnection,
} from "./util";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { verifyToken } from "./auth";
import { userSchema } from "./models/User";
import { _Workspace, workspaceSchema } from "./models/Workspace.ts";

export const getWorkspaces = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
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
    await closeMongooseConnection();
  }
};

export const addWorkspace = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
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
      console.log("Workspace added.");
      return AppResponse.createObject(200, workspaces, "Workspace Added!");
    } else {
      return AppResponse.createObject(400, null, "Missing Data!");
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    await closeMongooseConnection();
  }
};

export const deleteWorkspace = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
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
    await closeMongooseConnection();
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
