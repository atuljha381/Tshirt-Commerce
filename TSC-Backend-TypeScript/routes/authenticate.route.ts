import express from "express";
var router = express.Router();
import auth from "../controller/auth.controller";
// const auth = require("../controller/auth.controller");

/**
 * Routing the Methods for authentication
 */
router.post("/signup", auth.signupByPhoneNumberRoute);
router.post("/login", auth.loginByPhoneNumberRoute);
router.post("/forgot-password", auth.forgotPasswordRoute);
router.patch("/reset-password/:id", auth.resetPasswordRoute);
router.post("/otp", auth.sendOtpToPhoneRoute);
router.post("/otp-verify", auth.verifyOtpForPhoneRoute);

module.exports = router;
