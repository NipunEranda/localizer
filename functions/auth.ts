import middy, { HandlerLambda } from "middy";
import util, { AppResponse, _AppResponse } from "./util";
import axios from "axios";
import github, { User } from "./services/github";
import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda";
import * as mongoDB from "mongodb";
import { NextFunction } from "express";
import cookie from "cookie";

// https://api.github.com/applications/YOUR_CLIENT_ID/token

const systemLogin = async (event: APIGatewayProxyEvent) => {
  if (event.queryStringParameters?.code) {
    const mongoClient: mongoDB.MongoClient | null = util.getMongoClient();
    try {
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
              splitToken(response.data.access_token)[0],
              {
                secure: true,
                httpOnly: true,
                path: "/",
                maxAge: 24 * 60 * 60,
                sameSite: "strict",
              }
            );

            return AppResponse.createObject(
              200,
              { user: user, token: splitToken(response.data.access_token)[1] },
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
        console.log(response.data.error);
        AppResponse.createObject(400, response.data, response.data.error);
      }
    } catch (e) {
      console.log(e);
      return AppResponse.createObject(500, e, e.message);
    } finally {
      if (mongoClient) mongoClient.close();
    }
  }
  return AppResponse.createObject(400, null, "Auth code required");
};

export const verifyToken = () => {
  return {
    before: (handler: HandlerLambda, next: NextFunction) => {
      const cookies = cookie.parse(handler.event.headers.cookie);
      if (cookies.token && cookies["local._token"]) {
        axios
          .get(`https://api.github.com/rate_limit`, {
            headers: {
              Authorization: `Bearer ${cookies.token}${cookies["local._token"]}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          })
          .then((res) => {
            if (res.data.rate.remaining != 0) {
              axios
                .get(`https://api.github.com/octocat`, {
                  headers: {
                    Authorization: `Bearer ${cookies.token}${cookies["local._token"]}`,
                    "X-GitHub-Api-Version": "2022-11-28",
                  },
                })
                .then((res) => {
                  next();
                })
                .catch((e) => {
                  if (e.response.status == 401)
                    handler.callback(
                      null,
                      AppResponse.createObject(401, null, "Bad Credentials")
                    );
                });
            } else {
              handler.callback(
                null,
                AppResponse.createObject(
                  401,
                  null,
                  "Access Denied: Github request quota exceeded."
                )
              );
            }
          })
          .catch(() => {
            handler.callback(
              null,
              AppResponse.createObject(
                401,
                null,
                "Access Denied: Github request quota exceeded."
              )
            );
          });
      } else {
        handler.callback(
          null,
          AppResponse.createObject(401, null, "Access Denied")
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
    return result;
  } catch (e) {
    console.log(e);
    return AppResponse.createObject(500, e, e.message);
  }
};

function splitToken(token: string): string[] {
  const part1 = token
    .split("")
    .splice(0, token.length / 2)
    .join("");
  const part2 = token
    .split("")
    .splice(token.length / 2, token.length)
    .join("");
  return [part1, part2];
}

export const handler = middy(responseHandler);
