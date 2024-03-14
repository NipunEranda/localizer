import middy, { HandlerLambda } from "middy";
import {
  AppResponse,
  _AppResponse,
  connectMongoose,
  closeMongooseConnection,
} from "./util";
import axios from "axios";
import github from "./services/github";
import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda";
import { NextFunction } from "express";
import cookie from "cookie";
import { UserDocument, userSchema } from "./models/User";

// https://api.github.com/applications/YOUR_CLIENT_ID/token

const systemLogin = async (event: APIGatewayProxyEvent) => {
  if (event.queryStringParameters?.code) {
    try {
      await connectMongoose();
      // event.queryStringParameters.code
      const response = await axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token?client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${event.queryStringParameters.code}&redirect_uri=${process.env.VUE_APP_GITHUB_REDIRECT_URI}`,
        headers: {
          accept: "application/json",
        },
      });
      if (!response.data.error) {
        let user: UserDocument | null = await new Promise(
          async (resolve, reject) => {
            let user: UserDocument | null, email: string;
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
                if (user) {
                  user.email = email["email"];
                  resolve(user);
                } else resolve(null);
              })
              .catch(() => {
                resolve(user);
              });
          }
        );
        if (user) {
          //Check if user is already registered or not
          // const result = await database
          //   .collection("users")
          //   .findOne({ email: user.email, id: user.id });
          const existingUser = await userSchema.findOne({
            email: user.email,
            id: user.id,
          });

          if (!existingUser) {
            //If user doesn't exists, Register
            // insertedU = await database.collection("users").insertOne(user);
            user = await userSchema.create(user);
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
            {
              user: existingUser ? existingUser : user,
              token: splitToken(response.data.access_token)[1],
            },
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
    } catch (e) {
      console.log(e);
      return AppResponse.createObject(500, e, e.message);
    } finally {
      await closeMongooseConnection();
    }
  }
  return AppResponse.createObject(400, null, "Auth code required");
};

export const verifyToken = () => {
  return {
    before: (handler: HandlerLambda, next: NextFunction) => {
      if (handler.event.headers.cookie) {
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
                    handler.event.queryStringParameters["userId"] =
                      cookies.userId;
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
