import middy from "middy";
import {
  AppResponse,
  _Response,
  connectMongoose,
  closeMongooseConnection,
} from "./util";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { verifyToken } from "./auth";
import { languageSchema } from "./models/Language";

export const getLanguages = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    await connectMongoose();
    if (event.queryStringParameters) {
      const languages = await languageSchema.find({
        workspace: event.queryStringParameters.workspace,
      });
      return AppResponse.createObject(200, languages, null);
    } else return AppResponse.createObject(400, null, "Workspace required!");
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(e.statusCode, e, e.message);
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
      event.path == `${process.env.VUE_APP_API_URL}/language` &&
      event.httpMethod == "GET"
    ) {
      result = await getLanguages(event);
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
