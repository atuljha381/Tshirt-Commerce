const router = require("express").Router();
const customer = require("./../controller/customer.controller");

router.get("/", customer.getAllCustomers);
router.post("/", customer.createCustomer);
router.get("/:id", customer.getCustomerById);

module.exports = router;
