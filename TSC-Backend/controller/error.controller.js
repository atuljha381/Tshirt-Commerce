const AppError = require("../utils/tsc.error");

/**
 * Method to handle API call error occuring from wrong entering of url
 * Such as: spelling error etc
 * @returns an error message
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Method to handle API POST request call error for duplicate value
 */
const handleDuplicateFieldsDB = (err) => {
  const regex = /(["'])(?:(?=(\\?))\2.)*?\1/;
  const value = JSON.stringify(err.keyValue).match(regex)[0];
  console.log(value);
  const message = `Duplicate field value for : ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
};
 * Method to handle API POST request call error for validation error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log(errors);
  // const message = `Invalid Input Data. `;
  const message = `Invalid Input Data. ${errors.join(". ")}`;
  return new AppError(message, 500);
};

/**
 * Method to respond to errors recieved in Development mode
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    response: err.message,
    stack: err.stack,
  });
};

/**
 * Method to respond to errors recieved in Production mode
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      response: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);

    //Error Code : 11000 was the code recieved when Duplicate field value error was generated
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    //Validation Error Condition Check
    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};
