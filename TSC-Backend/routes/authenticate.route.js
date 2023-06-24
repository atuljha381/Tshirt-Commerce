const router = require("express").Router();
const auth = require("../controller/auth.controller");

/**
 * Routing the Methods for authentication
 */
router.post("/signup", auth.signUpByPhoneNumber);

module.exports = router;
