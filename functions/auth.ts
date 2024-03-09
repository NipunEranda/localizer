import middy, { HandlerLambda } from "middy";
import util, { AppResponse, _AppResponse } from "./util";
import axios from "axios";
import github, { User } from "./services/github";
import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda";
import * as mongoDB from "mongodb";
import { Request, Response, NextFunction } from "express";
import cookie from "cookie";
import Cookies from "js-cookie";

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

            const myCookie = cookie.serialize(
              "token",
              response.data.access_token,
              {
                secure: true,
                httpOnly: true,
                path: "/",
                maxAge: 24 * 60 * 60,
                sameSite: "Strict",
              }
            );

            return AppResponse.createObject(
              200,
              { user: user, token: response.data.access_token },
              "Authentication Success!",
              {
                "Set-Cookie": myCookie,
                "Cache-Control": "no-cache",
                "Content-Type": "text/html",
              }
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

export const verifyToken = () => {
  return {
    before: (handler: HandlerLambda, next: NextFunction) => {
      if (handler.event.headers.cookie) {
        axios
          .get(`https://api.github.com/octocat`, {
            headers: {
              Authorization: `Bearer ${handler.event.headers.cookie.replace(
                "token=",
                ""
              )}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          })
          .then((res) => {
            next();
          })
          .catch((e) => {
            if (e.response.status == 401)
              handler.callback(
                "Bad Credential",
                AppResponse.createObject(403, null, "Bad Credential")
              );
          });
      } else {
        handler.callback(
          "Access Denied",
          AppResponse.createObject(403, null, "Access Denied")
        );
      }
    },
  };
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
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, e, e.message);
  }
};

export const handler = middy(responseHandler);
