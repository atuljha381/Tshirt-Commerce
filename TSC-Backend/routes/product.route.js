const router = require("express").Router();
const product = require("./../controller/product.controller");

router.post("/", product.createProduct);
router.get("/", product.getAllProducts);
router.get("/:id", product.getProductById);
router.patch("/:id", product.updateProductById);
router.delete("/:id", product.deleteProductById);

module.exports = router;
