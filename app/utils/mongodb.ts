import { MongoClient, Db } from "mongodb";

// Retrieve MongoDB connection URI and database name from environment variables
const uri: string = process.env.MONGO_URI as string;
const dbName: string = process.env.DB_NAME as string;

// Declare a variable to hold the database connection once it's established
let dbConnection: Db | null = null;

// Async function to handle MongoDB connection
export async function mongoDb() {
  try {
    // If a connection has already been established, return the existing connection
    if (dbConnection) {
      return dbConnection;
    }

    // Connect to MongoDB using the URI
    const client = await MongoClient.connect(uri);

    // Store the database connection to avoid reconnecting multiple times
    dbConnection = client.db(dbName);

    console.log("Connected to the database");

    // Return the database connection object for further use
    return dbConnection;
  } catch (error) {
    // If there was an error during the connection attempt, log it and throw an error
    console.error("Couldn't connect to db", error);
    throw new Error("Database connection failed");
  }
}
