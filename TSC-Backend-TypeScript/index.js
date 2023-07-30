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
require("dotenv").config();
/**
 * Method to catch uncaught exceptions
 * Need to be placed at top of the code block
 */
process.on("uncaughtException", (err) => {
    logger_1.default.error("Uncaught Exception! Shutting Down", err);
    server.close(() => {
        process.exit(1);
    });
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(`${__dirname}/public`));
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
const port = process.env.PORT;
const server = app.listen(port, () => {
    logger_1.default.info(`TSC app listening on port http://localhost:${port}`);
});
/**
 * To Connect to Mongo DB
 */
(0, mongo_1.connectMongo)();
// app.use("/", (req, res) => {
//   res.send("Hello World");
// });
app.use("/auth", require("./routes/authenticate.route"));
app.use("/customer", require("./routes/customer.route"));
app.all("*", (req, res, next) => {
    logger_1.default.error(`Cannot find ${req.originalUrl} on this server`);
    next(new tsc_error_1.default(`Cannot find ${req.originalUrl} on this server`, 404));
});
app.use(error_controller_1.default);
/**
 * Event listener to handle Unhandled Rejection
 * When such types of error occur server should close and process should exit
 * On the platform where the app is hosted, it will try to restart the app again (Which is the right thing to do)
 */
process.on("unhandledRejection", (err) => {
    logger_1.default.error("Unhandled Rejection! Shutting Down", err);
    server.close(() => {
        process.exit(1);
    });
});
