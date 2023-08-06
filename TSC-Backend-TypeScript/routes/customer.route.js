"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = require("express").Router();
// const customer = require("../controller/customer.controller");
// const authController = require("../controller/auth.controller");
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const customer_controller_1 = __importDefault(require("../controller/customer.controller"));
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
/**
 * Routing the Methods with a link to make CRUD operation for Customer Data
 */
router.route("/").get(auth_controller_1.default.protectRoute, customer_controller_1.default.getAllCustomers);
router
    .route("/:id")
    .put(customer_controller_1.default.createCustomerById)
    .get(customer_controller_1.default.getCustomerById)
    .patch(customer_controller_1.default.updateCustomerById)
    .delete(auth_controller_1.default.protectRoute, auth_controller_1.default.restrictTo("admin"), customer_controller_1.default.deleteCustomerById);
module.exports = router;
