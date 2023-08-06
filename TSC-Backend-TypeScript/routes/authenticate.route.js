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
router.post("/signup", auth_controller_1.default.signupByPhoneNumberRoute);
router.post("/login", auth_controller_1.default.loginByPhoneNumberRoute);
router.post("/forgot-password", auth_controller_1.default.forgotPasswordRoute);
router.patch("/reset-password/:token", auth_controller_1.default.resetPasswordRoute);
router.post("/otp", auth_controller_1.default.sendOtpToPhoneRoute);
router.post("/otp-verify", auth_controller_1.default.verifyOtpForPhoneRoute);
module.exports = router;
