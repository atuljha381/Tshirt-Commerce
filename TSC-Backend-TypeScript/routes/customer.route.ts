import express from "express";
var router = express.Router();
import customer from "../controller/customer.controller";
import authController from "../controller/auth.controller";

/**
 * Routing the Methods with a link to make CRUD operation for Customer Data
 */

// Route to get all customers (GET method)
router.route("/").get(authController.protectRoute, customer.getAllCustomers);

// Route to handle specific customer based on the provided ID
router
  .route("/:id")
  .put(customer.createCustomerById) // Update customer data (PUT method)
  .get(customer.getCustomerById) // Get customer data by ID (GET method)
  .patch(customer.updateCustomerById) // Partial update customer data (PATCH method)
  .delete(
    authController.protectRoute, // Protect the route with authentication middleware
    authController.restrictTo("admin"), // Restrict deletion to admin only
    customer.deleteCustomerById // Delete customer data (DELETE method)
  );

router.route("/:id/address").patch(customer.addAddressForCustomer); // Partial update address data (PATCH method)

export default router;
