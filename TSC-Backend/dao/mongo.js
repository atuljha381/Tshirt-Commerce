const mongoose = require("mongoose");
require("dotenv").config();

async function connectMongo() {
  try {
    const connectionString = process.env.MONGODB_CONNECTION_STRING.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD
    );
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
    });
    const database = mongoose.connection;
    database.on("error", console.error.bind(console, "connection error: "));
    database.once("open", async function () {
      console.log("DB Connected successfully");
      // To Ingest Bulk Data
      //await loadData().catch(console.dir);
    });
  } catch (exception) {
    throw exception;
  }
}

module.exports = { connectMongo };
