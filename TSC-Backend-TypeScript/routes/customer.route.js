"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const customer_controller_1 = __importDefault(require("../controller/customer.controller"));
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
/**
 * Routing the Methods with a link to make CRUD operation for Customer Data
 */
// Route to get all customers (GET method)
router.route("/").get(auth_controller_1.default.protectRoute, customer_controller_1.default.getAllCustomers);
// Route to handle specific customer based on the provided ID
router
    .route("/:id")
    .put(customer_controller_1.default.createCustomerById) // Update customer data (PUT method)
    .get(customer_controller_1.default.getCustomerById) // Get customer data by ID (GET method)
    .patch(customer_controller_1.default.updateCustomerById) // Partial update customer data (PATCH method)
    .delete(auth_controller_1.default.protectRoute, // Protect the route with authentication middleware
auth_controller_1.default.restrictTo("admin"), // Restrict deletion to admin only
customer_controller_1.default.deleteCustomerById // Delete customer data (DELETE method)
);
router.route("/:id/address").patch(customer_controller_1.default.addAddressForCustomer); // Partial update address data (PATCH method)
exports.default = router;
