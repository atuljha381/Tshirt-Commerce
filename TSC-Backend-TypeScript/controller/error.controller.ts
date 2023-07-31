/**
 * Import necessary modules and dependencies
 */
import logger from "../middleware/logger";
import AppError from "../utils/tsc.error";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Method to handle API call error occurring from wrong entering of URL
 * Such as: spelling error, etc.
 * @returns an error message
 */
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  logger.error(message);
  return new AppError(message, 400);
};

/**
 * Method to handle API POST request call error for duplicate value
 */
const handleDuplicateFieldsDB = (err: any) => {
  const regex = /(["'])(?:(?=(\\?))\2.)*?\1/;
  const value = err.keyValue.match(regex)[0];
  const message = `Duplicate field value for: ${value}. Please use another value!`;
  logger.error(message);
  return new AppError(message, 400);
};

/**
 * Method to handle API POST request call error for validation error
 */
const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el) => el);
  logger.error(errors);
  const message = `Invalid Input Data. ${errors.join(". ")}`;
  logger.error(message);
  return new AppError(message, 500);
};

/**
 * Method to handle API POST request call for invalid token error
 */
const handleJWTError = () => {
  logger.error("Invalid token. Please login again");
  return new AppError("Invalid token. Please login again", 401);
};

/**
 * Method to handle API POST request call for token expiration error
 */
const handleJWTExpiredError = () => {
  logger.error("Token Expired. Please Login Again");
  return new AppError("Token Expired. Please Login Again", 401);
};

/**
 * Method to respond to errors received in Development mode
 */
const sendErrorDev = (err: any, res: any) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    response: err.message,
    stack: err.stack,
  });
};

/**
 * Method to respond to errors received in Production mode
 */
const sendErrorProd = (err: any, res: any) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      response: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      response: err.stack,
    });
  }
};

export = (err: any, req: any, res: any, next: any) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);

    // Error Code: 11000 was the code received when Duplicate field value error was generated
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // Validation Error Condition Check
    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }

    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
