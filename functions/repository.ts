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
import axios from "axios";
import github from "./services/github";
import { _Branch, _Repository } from "./models/Repository";

export const getUserRepositories = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    const userRepositories: _Repository[] = await github.getUserRepositories(
      event
    );
    return AppResponse.createObject(200, userRepositories, null);
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  }
};

export const getRepositoryBranches = async (
  event: APIGatewayProxyEvent
): Promise<AppResponse> => {
  try {
    const repositoryBranches = await github.getRepositoryBranches(event);
    return AppResponse.createObject(200, repositoryBranches, null);
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, null, e.message);
  }
};

export const responseHandler = async function (
  event: APIGatewayProxyEvent,
  context: Context
) {
  try {
    let result: AppResponse | null;
    if (
      event.path == `${process.env.VUE_APP_API_URL}/repository` &&
      event.httpMethod == "GET"
    ) {
      result = await getUserRepositories(event);
    } else if (
      event.path == `${process.env.VUE_APP_API_URL}/repository/branches` &&
      event.httpMethod == "GET"
    ) {
      result = await getRepositoryBranches(event);
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
