"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
// const auth = require("../controller/auth.controller");
/**
 * Routing the Methods for authentication
 */
// Route for user signup using phone number
router.post("/signup", auth_controller_1.default.signupByPhoneNumberRoute);
// Route for user login using phone number
router.post("/login", auth_controller_1.default.loginByPhoneNumberRoute);
// Route for requesting a password reset (forgot password)
router.post("/forgot-password", auth_controller_1.default.forgotPasswordRoute);
// Route for resetting password using a password reset token
router.patch("/reset-password/:token", auth_controller_1.default.resetPasswordRoute);
// Route for sending an OTP (one-time password) to a phone number
router.post("/otp", auth_controller_1.default.sendOtpToPhoneRoute);
// Route for verifying the OTP (one-time password) sent to a phone number
router.post("/otp-verify", auth_controller_1.default.verifyOtpForPhoneRoute);
module.exports = router;
