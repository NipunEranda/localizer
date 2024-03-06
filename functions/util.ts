const { MongoClient, ServerApiVersion } = require("mongodb");

// Create mongo client
export function getMongoClient() {
  try {
    const mongoClient = new MongoClient(process.env.MONGO_URL);
    return mongoClient;
  } catch (e) {
    return null;
  }
}

// Handle request responses
export function responseHandler(
  statusCode: number,
  data: any,
  message: string
) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(data),
    message: message,
  };
}
