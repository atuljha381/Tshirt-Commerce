import express from "express";
import { connectMongo } from "./dao/mongo";
import AppError from "./utils/tsc.error";
import globalErrorHandler from "./controller/error.controller";
import cors from "cors";
import logger from "./middleware/logger";

require("dotenv").config();

/**
 * Method to catch uncaught exceptions
 * Need to be placed at top of the code block
 */
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception! Shutting Down", err);
  server.close(() => {
    process.exit(1);
  });
});

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cors());

app.use((req: any, res: any, next: any) => {
  req.requestTime = new Date().toISOString();
  next();
});

const port = process.env.PORT;

const server = app.listen(port, () => {
  logger.info(`TSC app listening on port http://localhost:${port}`);
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
  logger.error(`Cannot find ${req.originalUrl} on this server`);
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

/**
 * Event listener to handle Unhandled Rejection
 * When such types of error occur server should close and process should exit
 * On the platform where the app is hosted, it will try to restart the app again (Which is the right thing to do)
 */
process.on("unhandledRejection", (err: any) => {
  logger.error("Unhandled Rejection! Shutting Down", err);
  server.close(() => {
    process.exit(1);
  });
});
