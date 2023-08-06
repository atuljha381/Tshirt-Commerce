"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = void 0;
// Import necessary modules and packages
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const logger_1 = __importDefault(require("../middleware/logger"));
// Get the MongoDB connection string and database password from environment variables
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
/**
 * Function to connect to the MongoDB database using Mongoose.
 * This function establishes a connection to the MongoDB server with the provided options.
 * It reads the MongoDB connection string and database password from environment variables.
 * The "<PASSWORD>" placeholder in the connection string is replaced with the actual database password.
 * If the connection is successful, a success message is logged, and if there's an error, an error message is logged.
 * @throws {Error} if there is an exception during the connection process.
 */
function connectMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Replace the "<PASSWORD>" placeholder in the connection string with the actual database password
            const connectionString = MONGODB_CONNECTION_STRING.replace("<PASSWORD>", DATABASE_PASSWORD);
            // Connect to the MongoDB server using Mongoose
            yield mongoose_1.default.connect(connectionString, {
                useNewUrlParser: true,
            });
            // Get the database connection instance
            const database = mongoose_1.default.connection;
            // Handle any errors that occur during the connection process
            database.on("error", console.error.bind(console, "connection error: "));
            // Once the connection is open, log a success message
            database.once("open", function () {
                logger_1.default.info("DB Connected successfully");
            });
        }
        catch (exception) {
            // If an exception occurs during the connection process, throw an error
            throw exception;
        }
    });
}
exports.connectMongo = connectMongo;
