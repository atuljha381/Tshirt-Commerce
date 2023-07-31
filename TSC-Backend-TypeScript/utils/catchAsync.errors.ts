/**
 * This higher-order function is used to handle asynchronous functions that may throw errors.
 * It takes an async function (fn) as input and returns a new middleware function to be used with Express routes.
 * The middleware function wraps the provided async function with a try-catch block and forwards any errors to the Express error handling middleware (next).
 * This helps to handle errors that occur in asynchronous functions and pass them to the global error handler.
 * @param {Function} fn - The asynchronous function to be wrapped by the middleware.
 * @returns {Function} - The middleware function that wraps the provided async function with error handling.
 */
export = (fn: any) => {
  return (req: any, res: any, next: any) => {
    fn(req, res, next).catch(next);
  };
};
