/**
 * Custom Error class for handling application-specific errors.
 */
class AppError extends Error {
  /**
   * The status code associated with the error.
   */
  public statusCode: any;

  /**
   * The status of the error ('fail' for client errors, 'error' for server errors).
   */
  public status: any;

  /**
   * A flag indicating whether the error is operational (true) or a programming error (false).
   * Operational errors are meant to be handled gracefully, while programming errors indicate bugs.
   */
  public isOperational: any;

  /**
   * Create an instance of the AppError class.
   * @param {string} message - The error message.
   * @param {number} statusCode - The status code associated with the error.
   */
  constructor(message: any, statusCode: any) {
    // Call the parent constructor (Error) with the error message
    super(message);

    // Set the statusCode and status properties
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Set the isOperational flag to true, as this is meant to be an operational error
    this.isOperational = true;

    // Capture the stack trace to identify where the error occurred
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
