/**
 * Custom Error class for handling application-specific errors.
 */
export class AppError extends Error {
  statusCode;
  status;
  isOperational;

  /**
   * Create an instance of the AppError class.
   * @param {string} message - The error message.
   * @param {number} statusCode - The status code associated with the error.
   */
  constructor(message, statusCode) {
    // Call the parent constructor (Error) with the error message
    super(message);

    // Set the statusCode and status properties
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Set the isOperational flag to true, as this is meant to be an operational error
    this.isOperational = true;

    // Capture the stack trace to identify where the error occurred
    Error.captureStackTrace(this, this.constructor);
    // Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
