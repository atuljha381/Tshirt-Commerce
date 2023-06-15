const router = require("express").Router();
const customer = require("./../controller/customer.controller");

/**
 * Routing the Methods with a link to make CRUD operation for Customer Data
 */
router.get("/", customer.getAllCustomers);
router.post("/", customer.createCustomer);
router.get("/:id", customer.getCustomerById);
router.patch("/:id", customer.updateCustomerById);
router.delete("/:id", customer.deleteCustomerById);

module.exports = router;
