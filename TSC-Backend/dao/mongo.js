const mongoose = require("mongoose");
require("dotenv").config();
// const { loadData } = require("../controller/loadData.js");

async function run() {
  try {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", async function () {
      console.log("DB Connected successfully");
      // To Ingest Bulk Data
      //await loadData().catch(console.dir);
    });
  } catch (exception) {
    throw exception;
  }
}

module.exports = { run };
