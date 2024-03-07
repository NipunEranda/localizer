import * as mongoDB from "mongodb";

// Create mongo client
const getMongoClient = () => {
  try {
    if (process.env.MONGO_URL) {
      const mongoClient: mongoDB.MongoClient = new mongoDB.MongoClient(
        process.env.MONGO_URL
      );
      return mongoClient;
    }
    return null;
  } catch (e) {
    return null;
  }
};

// Handle request responses
const responseHandler = (statusCode: number, data: Object | null, message: string) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data),
    message: message,
  };
};

export default { getMongoClient, responseHandler };
