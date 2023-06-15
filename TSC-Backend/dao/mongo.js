const mongoose = require("mongoose");
require("dotenv").config();

async function connectMongo() {
  try {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
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
