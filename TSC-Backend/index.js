const express = require("express");
const { connectMongo } = require("./dao/mongo");
const AppError = require("./utils/tsc.error");
const globalErrorHandler = require("./controller/error.controller");
const cors = require("cors");
require("dotenv").config();

/**
 * Method to catch uncaught exceptions
 * Need to be placed at top of the code block
 */
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting Down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cors());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`TSC app listening on port http://localhost:${port}`);
});

/**
 * To Connect to Mongo DB
 */
connectMongo();

// app.use("/", (req, res) => {
//   res.send("Hello World");
// });

app.use("/auth", require("./routes/authenticate.route"));
app.use("/customer", require("./routes/customer.route"));

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

/**
 * Event listener to handle Unhandled Rejection
 * When such types of error occur server should close and process should exit
 * On the platform where the app is hosted, it will try to restart the app again (Which is the right thing to do)
 */
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting Down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
