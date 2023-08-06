import express from "express";
var router = express.Router();
import auth from "../controller/auth.controller";
// const auth = require("../controller/auth.controller");

/**
 * Routing the Methods for authentication
 */

// Route for user signup using phone number
router.post("/signup", auth.signupByPhoneNumberRoute);

// Route for user login using phone number
router.post("/login", auth.loginByPhoneNumberRoute);

// Route for requesting a password reset (forgot password)
router.post("/forgot-password", auth.forgotPasswordRoute);

// Route for resetting password using a password reset token
router.patch("/reset-password/:token", auth.resetPasswordRoute);

// Route for sending an OTP (one-time password) to a phone number
router.post("/otp", auth.sendOtpToPhoneRoute);

// Route for verifying the OTP (one-time password) sent to a phone number
router.post("/otp-verify", auth.verifyOtpForPhoneRoute);

export default router;
