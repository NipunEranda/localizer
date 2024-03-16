import mongoose, { mongo } from "mongoose";

export interface _AppResponse {
  statusCode: number;
  body: string | null;
}

export interface _Response {
  data: Object | null;
  error: string | null;
}

export class AppResponse {
  statusCode: number;
  body: string | null;
  headers?: Object | null;

  constructor(
    statusCode: number,
    body: _Response | null,
    headers?: Object | null
  ) {
    this.statusCode = statusCode;
    this.body = JSON.stringify(body);
    this.headers = headers;
  }

  static createObject(
    statusCode: number,
    data: Object | null,
    error: string | null,
    headers?: Object | null
  ) {
    return new AppResponse(statusCode, { data: data, error: error }, headers);
  }
}

// // Create mongo client
// const getMongoClient = () => {
//   try {
//     if (process.env.MONGO_URL) {
//       const mongoClient: mongoDB.MongoClient = new mongoDB.MongoClient(
//         process.env.MONGO_URL
//       );
//       return mongoClient;
//     }
//     return null;
//   } catch (e) {
//     return null;
//   }
// };

// // Handle request responses
// const responseHandler = (obj: AppResponse) => {
//   return {
//     statusCode: obj.statusCode,
//     body: obj.body,
//   };
// };

export const connectMongoose = async () => {
  if (process.env.MONGO_URL && process.env.MONGO_DB) {
    // console.log("Connected to mongodb!");
    await mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DB}?retryWrites=true&`);
  }
};

export const closeMongooseConnection = async () => {
  if (mongoose.connection) {
    // console.log("mongodb connection closed!");
    await mongoose.connection.close();
  }
};
