import express from "express";
import { connectMongo } from "./dao/mongo";
import AppError from "./utils/tsc.error";
import globalErrorHandler from "./controller/error.controller";
import cors from "cors";
import logger from "./middleware/logger";

require("dotenv").config();

// Create an Express app
const app = express();

// Middleware: Parse request body as JSON
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(`${__dirname}/public`));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware: Attach request timestamp to each request
app.use((req: any, res: any, next: any) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Extract the port from the environment variable
const port = process.env.PORT;

// Start the Express server
const server = app.listen(port, () => {
  logger.info(`TSC app listening on port http://localhost:${port}`);
});

// Connect to the MongoDB database
connectMongo();

// Routes
app.use("/auth", require("./routes/authenticate.route"));
app.use("/customer", require("./routes/customer.route"));

// 404 Not Found - Handling unknown routes
app.all("*", (req, res, next) => {
  logger.error(`Cannot find ${req.originalUrl} on this server`);
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

// Event listener to handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception! Shutting Down", err);
  server.close(() => {
    process.exit(1);
  });
});

// Event listener to handle Unhandled Rejections
process.on("unhandledRejection", (err: any) => {
  logger.error("Unhandled Rejection! Shutting Down", err);
  server.close(() => {
    process.exit(1);
  });
});
