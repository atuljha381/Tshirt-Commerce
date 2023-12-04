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
/**
 * Import necessary modules and dependencies
 */
const customer_model_1 = __importDefault(require("./../models/customer.model"));
const phone_1 = require("./../utils/phone");
const email_1 = __importDefault(require("./../utils/email"));
const crypto_1 = __importDefault(require("crypto"));
const catchAsync_errors_1 = __importDefault(require("./../utils/catchAsync.errors"));
const tsc_error_1 = __importDefault(require("./../utils/tsc.error"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const logger_1 = __importDefault(require("../middleware/logger"));
dotenv.config();
// Get the JWT secret and expiry from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;
// Define the Authentication Controller class
class AuthControl {
    constructor() {
        this.signToken = (id) => {
            return jwt.sign({ id: id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRY,
            });
        };
        this.createSendToken = (user, statusCode, res) => {
            const token = this.signToken(user._id);
            res.status(statusCode).json({
                status: "success",
                token,
                user,
            });
        };
        this.signupByEmailController = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const newUser = yield customer_model_1.default.create({
                email: req.body.email,
            });
            this.createSendToken(newUser, 201, res);
        }));
        /**
         * Route to signup a user using their phone number
         * This method adds the phone number to the Database after verifying it
         */
        this.signupByPhoneNumberController = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Create a new user in the database with the provided phone number and password
            const newUser = yield customer_model_1.default.create({
                phone: req.body.phone,
                password: req.body.password,
            });
            this.createSendToken(newUser, 201, res);
        }));
        this.getClientInformation = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield customer_model_1.default.findOne(req.user);
            res.json({
                displayName: user === null || user === void 0 ? void 0 : user.firstName,
                id: user === null || user === void 0 ? void 0 : user._id,
            });
        }));
        this.loginByEmailController = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email) {
                logger_1.default.error("Email not provided");
                return next(new tsc_error_1.default("Please provide your Email Address", 400));
            }
            const user = yield customer_model_1.default.findOne({ email: email }).select("+password");
            if (!user || !(yield user.correctPassword(password, user.password))) {
                return next(new tsc_error_1.default("Email or Password does not exist", 401));
            }
            this.createSendToken(user, 200, res);
        }));
        /**
         * Middleware for handling user login using phone number and password
         */
        this.loginByPhoneNumberController = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { phone, password } = req.body;
            // Check if Phone Number exists in the request body
            if (!phone) {
                // If phone number is not provided, log an error and return a 400 Bad Request error
                logger_1.default.error("Please provide Phone Number!");
                return next(new tsc_error_1.default("Please provide Phone Number!", 400));
            }
            // Check if Phone Number exists in the database
            const user = yield customer_model_1.default.findOne({ phone: phone }).select("+password");
            // If the user doesn't exist or the provided password is incorrect, return a 401 Unauthorized error
            if (!user || !(yield user.correctPassword(password, user.password))) {
                return next(new tsc_error_1.default("Incorrect phone number or password", 401));
            }
            this.createSendToken(user, 200, res);
        }));
        /**
         * Middleware for sending an OTP to a phone number
         */
        this.sendOtpToPhoneRoute = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Call the sendOtpToPhoneNumber function to send the OTP to the provided phone number
            yield (0, phone_1.sendOtpToPhoneNumber)(req.body.phone, req.body.channel);
            // Respond with a success status (HTTP 200 OK) indicating that the OTP was sent successfully
            res.status(200).json({
                status: "success",
            });
        }));
        /**
         * Middleware for verifying an OTP for a phone number
         */
        this.verifyOtpForPhoneRoute = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Call the verifyOTP function to verify the OTP for the provided phone number
            yield (0, phone_1.verifyOTP)(req.body.phone, req.body.otp);
            // Respond with a success status (HTTP 200 OK) indicating that the OTP was successfully verified
            res.status(200).json({
                status: "success",
            });
        }));
        /**
         * Middleware to protect routes using JWT
         * Security measure to ensure the user with valid JWT is only allowed to view the page
         */
        this.protectRoute = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Getting the JWT token from the request headers and checking if it's present
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            // If token is missing, return a 401 Unauthorized error
            if (!token) {
                return next(new tsc_error_1.default("You are not logged in!", 401));
            }
            // Verify the authenticity of the token
            const decoded = yield jwt.verify(token, JWT_SECRET);
            if (!decoded) {
                return next(new tsc_error_1.default("You are not logged in!", 401));
            }
            // Check if the user associated with the token still exists in the database
            const currentUser = yield customer_model_1.default.findById(decoded.id);
            if (!currentUser) {
                return next(new tsc_error_1.default("The user belonging to the token no longer exists", 401));
            }
            // Check if the user changed the password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next(new tsc_error_1.default("User recently changed password! Please login again", 401));
            }
            // Grant access to the protected route by attaching the user object to the request
            req.user = currentUser;
            next();
        }));
        /**
         * Middleware to restrict access to specific roles only (e.g., admin)
         * @param {...any} roles - Array of roles that are allowed to access the route
         * @returns If the user role is not in the allowed roles, an error is returned
         */
        this.restrictTo = (...roles) => {
            return (req, res, next) => {
                // Check if the user's role is included in the allowed roles
                if (!roles.includes(req.user.userRole)) {
                    // If the user's role is not allowed, return a 403 Forbidden error
                    return next(new tsc_error_1.default("You do not have permission to perform this action", 403));
                }
                // If the user's role is allowed, proceed to the next middleware or route handler
                next();
            };
        };
        /**
         * Middleware for handling the "forgot password" functionality
         */
        this.forgotPasswordRoute = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Get the user based on the email provided in the request body
            const user = yield customer_model_1.default.findOne({ email: req.body.email });
            // If no user is found with the provided email, return a 404 Not Found error
            if (!user) {
                return next(new tsc_error_1.default("No user found for the given email", 404));
            }
            // Generate a random password reset token and save it to the user's document
            const resetToken = user.createPasswordResetToken();
            yield user.save({ validateBeforeSave: false });
            // Construct the URL for the password reset page using the reset token
            const resetUrl = `${req.protocol}://${req.get("host")}/auth/reset-password/${resetToken}`;
            // Compose the email message to be sent to the user
            const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email.`;
            try {
                // Send the password reset email to the user's email address
                yield (0, email_1.default)({
                    email: user.email,
                    subject: "Your password reset token (valid for 10 minutes)",
                    message,
                });
                // Respond with a success status (HTTP 200 OK) and a message indicating that the reset token was sent to the user's email
                res.status(200).json({
                    status: "success",
                    message: "Token sent to email",
                });
            }
            catch (err) {
                // If there was an error sending the email, reset the user's password reset token and expiration date and save the changes
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                yield user.save({ validateBeforeSave: false });
                // Return a 500 Internal Server Error with a message indicating the email sending failure
                return next(new tsc_error_1.default("There was an error sending the email", 500));
            }
        }));
        /**
         * Middleware for resetting the user's password using the provided reset token
         */
        this.resetPasswordRoute = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Get the user based on the reset token sent as a URL parameter
            const hashedToken = crypto_1.default
                .createHash("sha256")
                .update(req.params.token)
                .digest("hex");
            const user = yield customer_model_1.default.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() },
            });
            // If the token is invalid or has expired, return a 400 Bad Request error
            if (!user) {
                return next(new tsc_error_1.default("Token is invalid or has expired", 400));
            }
            // Set the new password for the user and clear the password reset token and expiration date
            user.password = req.body.password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            yield user.save();
            // Log the user in by signing a new JWT token and send it as a response
            this.createSendToken(user, 200, res);
        }));
        this.isTokenValid = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(" ")[1];
            if (!token) {
                return next(new tsc_error_1.default("You are not logged in", 401));
            }
            const decoded = yield jwt.verify(token, JWT_SECRET);
            if (!decoded) {
                return next(new tsc_error_1.default("You are not verified", 401));
            }
            const user = yield customer_model_1.default.findById(decoded.id);
            if (!user) {
                return next(new tsc_error_1.default("User does not exist", 401));
            }
            res.status(200).json({
                status: "success",
                displayName: user,
                id: user.id,
            });
        }));
    }
}
// Create an instance of the AuthControl class and export it
const authController = new AuthControl();
exports.default = authController;
