import middy from "middy";
import {
  AppResponse,
  _Response,
  connectMongoose,
  closeMongooseConnection,
} from "./util";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { verifyToken } from "./auth";
import { _File, fileSchema } from "./models/File";

export const getFiles = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
    // Get user workspaces
    const files = await fileSchema.find({
      workspace: event.queryStringParameters?.workspace,
      owner: event.queryStringParameters!.userId,
      deleted: false,
    });
    return AppResponse.createObject(200, files, null);
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  } finally {
    await closeMongooseConnection();
  }
};

export const addFile = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
    if (event.body) {
      const file: _File = JSON.parse(event.body);
      await fileSchema.create(file);

      // Get user workspaces
      const files = await fileSchema.find({
        workspace: file.workspace,
        owner: file.owner,
      });
      return AppResponse.createObject(200, files, null);
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

export const updateFile = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
    if (event.body) {
      const file: _File = JSON.parse(event.body);

      await fileSchema.updateOne(
        { _id: file._id },
        {
          $set: {
            name: file.name,
            branch: file.branch,
            versionId: file.versionId,
            type: file.type,
            from: file.from,
            to: file.to,
            modifiedOn: new Date(),
            modifiedBy: file.modifiedBy,
            fileUrl: file.fileUrl,
          },
        }
      );
      event.queryStringParameters!.workspace = file.workspace;
      return AppResponse.createObject(
        200,
        JSON.parse((await getFiles(event)).body!).data,
        null
      );
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

export const removeFile = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
    await fileSchema.updateOne(
      { _id: event.queryStringParameters!.id },
      { $set: { deleted: true } }
    );
    return AppResponse.createObject(
      200,
      JSON.parse((await getFiles(event)).body!).data,
      null
    );
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
      event.path == `${process.env.VUE_APP_API_URL}/file` &&
      event.httpMethod == "GET"
    ) {
      result = await getFiles(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/file` &&
      event.httpMethod == "POST"
    ) {
      result = await addFile(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/file` &&
      event.httpMethod == "DELETE"
    ) {
      result = await removeFile(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/file` &&
      event.httpMethod == "PUT"
    ) {
      result = await updateFile(event);
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
