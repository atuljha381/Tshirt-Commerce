"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongo_1 = require("./dao/mongo");
const tsc_error_1 = __importDefault(require("./utils/tsc.error"));
const error_controller_1 = __importDefault(require("./controller/error.controller"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./middleware/logger"));
const authenticate_route_1 = __importDefault(require("./routes/authenticate.route"));
const customer_route_1 = __importDefault(require("./routes/customer.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
require("dotenv").config();
// Create an Express app
const app = (0, express_1.default)();
// Middleware: Parse request body as JSON
app.use(express_1.default.json());
// Serve static files from the "public" directory
app.use(express_1.default.static(`${__dirname}/public`));
// Enable Cross-Origin Resource Sharing (CORS)
app.use((0, cors_1.default)());
// Middleware: Attach request timestamp to each request
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
// Extract the port from the environment variable
const port = process.env.PORT;
// Start the Express server
const server = app.listen(port, () => {
    logger_1.default.info(`TSC app listening on port http://localhost:${port}`);
});
// Connect to the MongoDB database
(0, mongo_1.connectMongo)();
// Routes
app.use("/auth", authenticate_route_1.default);
app.use("/customer", customer_route_1.default);
app.use("product", product_route_1.default);
// 404 Not Found - Handling unknown routes
app.all("*", (req, res, next) => {
    logger_1.default.error(`Cannot find ${req.originalUrl} on this server`);
    next(new tsc_error_1.default(`Cannot find ${req.originalUrl} on this server`, 404));
});
// Global Error Handler Middleware
app.use(error_controller_1.default);
// Event listener to handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
    logger_1.default.error("Uncaught Exception! Shutting Down", err);
    server.close(() => {
        process.exit(1);
    });
});
// Event listener to handle Unhandled Rejections
process.on("unhandledRejection", (err) => {
    logger_1.default.error("Unhandled Rejection! Shutting Down", err);
    server.close(() => {
        process.exit(1);
    });
});
