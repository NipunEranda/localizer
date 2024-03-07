import middy from "middy";
import util from "./util";
import axios from "axios";
import github, { User } from "./services/github";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

exports.systemLogin = async (event) => {
  if (event.queryStringParameters.code) {
    try {
      // event.queryStringParameters.code
      const response = await axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token?client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${event.queryStringParameters.code}&redirect_uri=${process.env.VUE_APP_GITHUB_REDIRECT_URI}`,
        headers: {
          accept: "application/json",
        },
      });
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
            user.email = email;
            resolve(user);
          })
          .catch(() => {
            resolve(null);
          });
      });
      return util.responseHandler(
        200,
        { user: user, token: response.data.access_token },
        "Authentication Success!"
      );
    } catch (e) {
      console.log(e);
      return { statusCode: 200, body: null, message: null };
    }
  }
  return {
    statusCode: 200,
    body: null,
    message: null,
  };
};

const handler = async function (event: APIGatewayProxyEvent, context: Context) {
  try {
    var result = null;
    if (
      event.path == `${process.env.VUE_APP_API_URL}/auth/github` &&
      event.httpMethod == "GET"
    ) {
      result = await exports.systemLogin(event);
    }
    return result;
  } catch (e) {
    console.log(e);
    return util.responseHandler(500 || e.status, e, e.message);
  }
};

exports.handler = middy(handler);
