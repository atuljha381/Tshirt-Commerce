import mongoose, { ConnectOptions } from "mongoose";
// import * as env from "env-var";

import * as dotenv from "dotenv";
dotenv.config();

const MONGODB_CONNECTION_STRING: any = process.env.MONGODB_CONNECTION_STRING;
const DATABASE_PASSWORD: any = process.env.DATABASE_PASSWORD;

export async function connectMongo() {
  try {
    const connectionString = MONGODB_CONNECTION_STRING.replace(
      "<PASSWORD>",
      DATABASE_PASSWORD
    );
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
    } as ConnectOptions);
    const database = mongoose.connection;
    database.on("error", console.error.bind(console, "connection error: "));
    database.once("open", async function () {
      console.log("DB Connected successfully");
    });
  } catch (exception) {
    throw exception;
  }
}
