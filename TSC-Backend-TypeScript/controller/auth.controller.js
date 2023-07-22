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
const customer_model_1 = __importDefault(require("./../models/customer.model"));
const phone_1 = require("./../utils/phone");
const email_1 = __importDefault(require("./../utils/email"));
const tsc_error_1 = __importDefault(require("./../utils/tsc.error"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;
class AuthControl {
    constructor() {
        this.signToken = (id) => {
            return jwt.sign({ id: id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRY,
            });
        };
        /**
         * This method is supposed to add the phone number to the Database after the phone number is verified
         */
        this.signupByPhoneNumberRoute = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const newUser = yield customer_model_1.default.create({
                phone: req.body.phone,
                password: req.body.password,
            });
            const token = this.signToken(newUser._id);
            res.status(201).json({
                status: "success",
                token,
                data: {
                    user: newUser,
                },
            });
        });
        /**
         * Middleware for the purpose of Login
         */
        this.loginByPhoneNumberRoute = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { phone, password } = req.body;
            //Check if Phone Number exists in the req body
            if (!phone) {
                return next(new tsc_error_1.default("Please provide Phone Number!", 400));
            }
            //Check if Phone Number exists in the DB
            const user = yield customer_model_1.default.findOne({ phone: phone }).select("+password");
            if (!user || !(yield user.correctPassword(password, user.password))) {
                return next(new tsc_error_1.default("Incorrect email or password", 401));
            }
            //If everything OK send token to client
            const token = this.signToken(user.id);
            res.status(200).json({
                status: "success",
                token,
            });
        });
        this.sendOtpToPhoneRoute = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield (0, phone_1.sendOtpToPhoneNumber)(req.body.phone, req.body.channel);
            res.status(200).json({
                status: "success",
            });
        });
        this.verifyOtpForPhoneRoute = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield (0, phone_1.verifyOTP)(req.body.phone, req.body.otp);
            res.status(200).json({
                status: "success",
            });
        });
        /**
         * Middleware to protect routes using JWT
         * Security measure to ensure the user with valid JWT is only allowed to view the page
         */
        this.protectRoute = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            //Getting token and check if it's there
            let token;
            if (req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
            }
            if (!token) {
                return next(new tsc_error_1.default("You are not logged in!", 401));
            }
            //Verification of token
            // const decoded: any = await promisify(jwt.verify(token, JWT_SECRET);
            const decoded = yield jwt.verify(token, JWT_SECRET);
            //Check if user still exists
            const currentUser = yield customer_model_1.default.findById(decoded.id);
            if (!currentUser) {
                return next(new tsc_error_1.default("The user belonging to the token no longer exists", 401));
            }
            //Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next(new tsc_error_1.default("User recently changed password! Please login again", 401));
            }
            //Grant Access to protected route
            req.user = currentUser;
            next();
        });
        /**
         * Middleware to restrict deletion to admin only
         * @param  {...any} roles
         * @returns error if the argument is not admin
         */
        this.restrictTo = (...roles) => {
            return (req, res, next) => {
                if (!roles.includes(req.user.userRole)) {
                    return next(new tsc_error_1.default("You do not have permission to perform this action", 403));
                }
                next();
            };
        };
        this.forgotPasswordRoute = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            //Get user based on posted number/email
            const user = yield customer_model_1.default.findOne({ email: req.body.email });
            if (!user) {
                return next(new tsc_error_1.default("No user found for the given number", 404));
            }
            //Generate the random reset token
            const resetToken = user.createPasswordResetToken();
            yield user.save({ validateBeforeSave: false });
            //Send it to user's email
            const resetUrl = `${req.protocol}://${req.get("host")}/auth/reset-password/${resetToken}`;
            const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password please ignore this mail`;
            try {
                yield (0, email_1.default)({
                    email: user.email,
                    subject: "Your password reset token (valid for 10 min)",
                    message,
                });
                res.status(200).json({
                    status: "success",
                    message: "Token sent to email",
                });
            }
            catch (err) {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                yield user.save({ validateBeforeSave: false });
                return next(new tsc_error_1.default("There was an error sending the email", 500));
            }
        });
        this.resetPasswordRoute = (req, res, next) => { };
    }
}
const authController = new AuthControl();
exports.default = authController;
