const router = require("express").Router();
const auth = require("../controller/auth.controller");

/**
 * Routing the Methods for authentication
 */
router.post("/signup", auth.signupByPhoneNumber);
router.post("/login", auth.loginByPhoneNumber);
router.post("/forgot-password", auth.forgotPassword);
router.patch("/reset-password/:id", auth.resetPassword);
router.post("/otp", auth.loginByPhoneOTP);
router.post("/otp-verify", auth.verifyOtpForPhoneNumber);

module.exports = router;
