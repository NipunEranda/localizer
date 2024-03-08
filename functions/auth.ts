import middy from "middy";
import util, { AppResponse, _AppResponse } from "./util";
import axios from "axios";
import github, { User } from "./services/github";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import * as mongoDB from "mongodb";
import { Request, Response, NextFunction } from "express";

// https://api.github.com/applications/YOUR_CLIENT_ID/token

const systemLogin = async (event) => {
  if (event.queryStringParameters.code) {
    try {
      const mongoClient: mongoDB.MongoClient | null = util.getMongoClient();
      let insertedU: mongoDB.InsertOneResult<mongoDB.BSON.Document>;

      // event.queryStringParameters.code
      const response = await axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token?client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${event.queryStringParameters.code}&redirect_uri=${process.env.VUE_APP_GITHUB_REDIRECT_URI}`,
        headers: {
          accept: "application/json",
        },
      });
      if (!response.data.error) {
        const user: User | null = await new Promise(async (resolve, reject) => {
          let user: User, email: string;
          Promise.all(
            [
              github.getUserDetails(response.data.access_token),
              github.getUserEmail(response.data.access_token),
            ].map(async (res, r) => {
              switch (r) {
                case 0:
                  user = await res;
                  break;
                case 1:
                  email = await res;
                  break;
              }
            })
          )
            .then(() => {
              user.email = email["email"];
              resolve(user);
            })
            .catch(() => {
              resolve(user);
            });
        });
        if (user) {
          if (mongoClient) {
            const clientPromise = mongoClient.connect();
            const database = (await clientPromise).db(process.env.MONGO_DB);

            //Check if user is already registered or not
            const result = await database
              .collection("users")
              .findOne({ email: user.email, id: user.id });

            if (!result) {
              //If user doesn't exists, Register
              insertedU = await database.collection("users").insertOne(user);
              user._id = insertedU.insertedId;
            } else {
              user._id = result._id;
            }
            return AppResponse.createObject(
              200,
              { user: user, token: response.data.access_token },
              "Authentication Success!"
            );
          } else {
            AppResponse.createObject(500, null, "Mongo db connection failed");
          }
        } else {
          AppResponse.createObject(400, null, "Authentication failed!");
        }
      } else {
        AppResponse.createObject(400, response.data, response.data.error);
      }
    } catch (e) {
      console.log(e);
      return AppResponse.createObject(500, e, e.message);
    }
  }
  return AppResponse.createObject(400, null, "Auth code required");
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req);
  } catch (e) {
    console.log(e);
  }
  next;
};

const responseHandler = async function (
  event: APIGatewayProxyEvent,
  context: Context
) {
  try {
    var result: AppResponse;
    if (
      event.path == `${process.env.VUE_APP_API_URL}/auth/github` &&
      event.httpMethod == "GET"
    ) {
      result = await systemLogin(event);
    } else {
      result = AppResponse.createObject(500, null, "Empty Response!");
    }
    return result;
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, e, e.message);
  }
};

export const handler = middy(responseHandler);
