const router = require("express").Router();
const auth = require("../controller/auth.controller");

/**
 * Routing the Methods for authentication
 */
router.post("/signup", auth.signupByPhoneNumber);
router.post("/login", auth.loginByPhoneNumber);

router.post("/forgot", auth.forgotPassword);
router.post("/reset", auth.resetPassword);

module.exports = router;
