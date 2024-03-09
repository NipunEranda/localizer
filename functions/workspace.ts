import middy from "middy";
import utils, { AppResponse, _Response } from "./util";
import * as mongoDB from "mongodb";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import util from "./util";
import { verifyToken } from "./auth";
import { ObjectId } from "mongodb";

interface _Workspace {
  name: string;
  deleted: boolean;
  isActive: boolean;
}

class Workspace {
  name: string;
  deleted: boolean;
  isActive: boolean;

  constructor(obj: _Workspace) {
    this.name = obj.name;
    this.deleted = obj.deleted;
    this.isActive = obj.isActive;
  }
}

export const getWorkspaces = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  const mongoClient: mongoDB.MongoClient | null = utils.getMongoClient();
  try {
    if (mongoClient) {
      const clientPromise = mongoClient.connect();
      const database = (await clientPromise).db(process.env.MONGO_DB);

      // Get workspaces
      const workspaces = await database
        .collection("workspaces")
        .find({ deleted: false, isActive: true })
        .toArray();
      return AppResponse.createObject(200, workspaces, null);
    } else {
      return AppResponse.createObject(400, null, "Mongo db connection failed");
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    if (mongoClient) mongoClient.close();
  }
};

export const addWorkspace = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  const mongoClient = utils.getMongoClient();
  try {
    if (mongoClient) {
      const clientPromise = mongoClient.connect();
      const database = (await clientPromise).db(process.env.MONGO_DB);
      if (event.body) {
        const workspace: Workspace = JSON.parse(event.body);

        // Insert workspace
        await database.collection("workspaces").insertOne(workspace);
        // Get all active workspaces
        const workspaces = await database
          .collection("workspaces")
          .find({ deleted: false, isActive: true })
          .toArray();

        return AppResponse.createObject(200, workspaces, "Workspace Added!");
      } else {
        return AppResponse.createObject(400, null, "Empty data recieved!");
      }
    } else {
      return AppResponse.createObject(400, null, "Mongo db connection failed!");
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    if (mongoClient) mongoClient.close();
  }
};

export const deleteWorkspace = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  const mongoClient = utils.getMongoClient();
  try {
    if (mongoClient) {
      const workspaceId = event.queryStringParameters?.id;
      if (workspaceId) {
        const clientPromise = mongoClient.connect();
        const database = (await clientPromise).db(process.env.MONGO_DB);

        // Update workspace
        await database
          .collection("workspaces")
          .updateOne(
            { _id: new ObjectId(workspaceId) },
            { $set: { deleted: true, isActive: false } }
          );

        // Get all active workspaces
        const workspaces = await database
          .collection("workspaces")
          .find({ deleted: false, isActive: true })
          .toArray();

        return AppResponse.createObject(200, workspaces, "Workspace Removed!");
      } else {
        return AppResponse.createObject(
          400,
          null,
          "Please provide the workspace Id."
        );
      }
    } else {
      return AppResponse.createObject(400, null, "Mongo db connection failed!");
    }
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    if (mongoClient) mongoClient.close();
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
    return AppResponse.createObject(e.statusCode, e, e.message);
  }
};

export const handler = middy(responseHandler).use(verifyToken());
