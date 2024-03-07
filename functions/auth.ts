import middy from "middy";
import util from "./util";
import axios from "axios";
import github, { User } from "./services/github";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import * as mongoDB from "mongodb";

exports.systemLogin = async (event) => {
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
          }else{
            user._id = result._id;
          }

          return util.responseHandler(
            200,
            { user: user, token: response.data.access_token },
            "Authentication Success!"
          );
        } else {
          return util.responseHandler(400, null, "Mongo db connection failed");
        }
      } else {
        return util.responseHandler(400, null, "Authentication failed!");
      }
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
