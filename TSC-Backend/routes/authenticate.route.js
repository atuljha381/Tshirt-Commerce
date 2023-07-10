const router = require("express").Router();
const auth = require("../controller/auth.controller");

/**
 * Routing the Methods for authentication
 */
router.post("/signup", auth.signupByPhoneNumber);
router.post("/login", auth.loginByPhoneNumber);

module.exports = router;
