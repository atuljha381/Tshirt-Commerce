const router = require("express").Router();
const customer = require("../controller/customer.controller");
const authController = require("../controller/auth.controller");
/**
 * Routing the Methods with a link to make CRUD operation for Customer Data
 */
router.route("/").get(authController.protectRoute, customer.getAllCustomers);

router
  .route("/:id")
  .put(customer.createCustomerById)
  .get(customer.getCustomerById)
  .patch(customer.updateCustomerById)
  .delete(
    authController.protectRoute,
    authController.restrictTo("admin"),
    customer.deleteCustomerById
  );

module.exports = router;