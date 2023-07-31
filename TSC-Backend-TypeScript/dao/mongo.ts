// Import necessary modules and packages
import mongoose, { ConnectOptions } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import logger from "../middleware/logger";

// Get the MongoDB connection string and database password from environment variables
const MONGODB_CONNECTION_STRING: any = process.env.MONGODB_CONNECTION_STRING;
const DATABASE_PASSWORD: any = process.env.DATABASE_PASSWORD;

/**
 * Function to connect to the MongoDB database using Mongoose.
 * This function establishes a connection to the MongoDB server with the provided options.
 * It reads the MongoDB connection string and database password from environment variables.
 * The "<PASSWORD>" placeholder in the connection string is replaced with the actual database password.
 * If the connection is successful, a success message is logged, and if there's an error, an error message is logged.
 * @throws {Error} if there is an exception during the connection process.
 */
export async function connectMongo() {
  try {
    // Replace the "<PASSWORD>" placeholder in the connection string with the actual database password
    const connectionString = MONGODB_CONNECTION_STRING.replace(
      "<PASSWORD>",
      DATABASE_PASSWORD
    );

    // Connect to the MongoDB server using Mongoose
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
    } as ConnectOptions);

    // Get the database connection instance
    const database = mongoose.connection;

    // Handle any errors that occur during the connection process
    database.on("error", console.error.bind(console, "connection error: "));

    // Once the connection is open, log a success message
    database.once("open", function () {
      logger.info("DB Connected successfully");
    });
  } catch (exception) {
    // If an exception occurs during the connection process, throw an error
    throw exception;
  }
}
