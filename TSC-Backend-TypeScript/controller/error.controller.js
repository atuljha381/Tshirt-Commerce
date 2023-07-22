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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const tsc_error_1 = __importDefault(require("../utils/tsc.error"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
/**
 * Method to handle API call error occuring from wrong entering of url
 * Such as: spelling error etc
 * @returns an error message
 */
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new tsc_error_1.default(message, 400);
};
/**
 * Method to handle API POST request call error for duplicate value
 */
const handleDuplicateFieldsDB = (err) => {
    const regex = /(["'])(?:(?=(\\?))\2.)*?\1/;
    const value = err.keyValue.match(regex)[0];
    console.log(value);
    const message = `Duplicate field value for : ${value}. Please use another value!`;
    return new tsc_error_1.default(message, 400);
};
/**
 * Method to handle API POST request call error for validation error
 */
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el);
    console.log(errors);
    // const message = `Invalid Input Data. `;
    const message = `Invalid Input Data. ${errors.join(". ")}`;
    return new tsc_error_1.default(message, 500);
};
/**
 * Method to handle API POST request call for invalid token error
 */
const handleJWTError = () => {
    return new tsc_error_1.default("Invalid token. Please login again", 401);
};
/**
 * Method to handle API POST request call for token expiration error
 */
const handleJWTExpiredError = () => {
    return new tsc_error_1.default("Token Expired. Please Login Again", 401);
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
    }
    else {
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
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = Object.assign({}, err);
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        //Error Code : 11000 was the code recieved when Duplicate field value error was generated
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        //Validation Error Condition Check
        if (err.name === "ValidationError") {
            error = handleValidationErrorDB(error);
        }
        if (error.name === "JsonWebTokenError")
            error = handleJWTError();
        if (error.name === "TokenExpiredError")
            error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
