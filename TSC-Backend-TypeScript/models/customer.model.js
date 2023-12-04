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
/*
 * Customer Database Schema File
 * Import necessary modules and packages
 */
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const logger_1 = __importDefault(require("../middleware/logger"));
const query = {};
/**
 * Defining the Customer Schema
 */
const customerSchema = new mongoose_1.default.Schema({
    firstName: { type: String },
    lastName: { type: String },
    phone: {
        type: String,
        unique: true,
        // required: [true, "Phone number required"],
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
    },
    userRole: {
        type: String,
        enum: ["admin", "consumer", "seller"],
        default: "consumer",
    },
    password: {
        type: String,
        minLength: 8,
        // required: [true, "Please provide a password"],
        select: false,
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now(),
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
    passwordResetToken: String,
    passwordResetExpires: Date,
});
/**
 * To ensure that token is always created after the password has been changed
 * Middleware to update the passwordChangedAt field when the password is modified or a new password is created.
 */
customerSchema.pre("save", function (next) {
    if (this.isModified("password") || this.isNew)
        return next();
    const oneSecondAgoTimestamp = Date.now() - 1000;
    this.passwordChangedAt = new Date(oneSecondAgoTimestamp);
    next();
});
/**
 * Encrypting the password before saving into the database
 * Middleware to hash the password before saving it to the database.
 */
customerSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        let pswrd = this.password;
        this.password = yield bcrypt_1.default.hash(pswrd, 12);
        // this.passwordConfirm = undefined
        next();
    });
});
/**
 * Checking if the password is correct
 * Method to compare the candidate password with the user's stored hashed password.
 * @param {*} candidatePassword - The password provided by the user during login.
 * @param {*} userPassword - The hashed password stored in the database.
 * @returns {boolean} - True if the candidate password matches the user's password, false otherwise.
 */
customerSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(candidatePassword, userPassword);
    });
};
/**
 * Checks if the password was changed while the JWT token was active
 * Method to check if the user's password was changed after the JWT token was issued.
 * @param {JWTTimeStamp} JWTTimestamp - The time the JWT was issued.
 * @returns {boolean} - True if the password was changed after the JWT token was issued, false otherwise.
 */
customerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = Math.ceil(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};
/**
 * Method to create a password reset token for the user
 * Generates a random token, hashes it, and stores it in the passwordResetToken field of the user.
 * It also sets the passwordResetExpires field to the current time plus 10 minutes.
 * @returns {string} - The generated password reset token.
 */
customerSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    logger_1.default.log(resetToken, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // For(Minutes) * For(Seconds) * For(Milliseconds)
    return resetToken;
};
// Create the Customer model using the customerSchema
var Customer = (0, mongoose_1.model)("Customer", customerSchema);
exports.default = Customer;
/**
 * Also can write as:
 * const customer = mongoose.model("Customer", customerSchema);
 * module.exports = customer
 */
