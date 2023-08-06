import express from "express";
var router = express.Router();
import product from "../controller/product.controller";
import authController from "../controller/auth.controller";

router
  .route("/")
  .get(authController.protectRoute, product.getAllProducts)
  .post(product.addProduct);

router.route("/rating/:id").patch(product.addRatingsByProductId);
router.route("/buy/:id").patch(product.buyingProduct);
router
  .route("/:id")
  .get(product.getProductById)
  .patch(product.updateProductById)
  .delete(
    authController.protectRoute,
    authController.restrictTo("admin"),
    product.deleteProductById
  );

export default router;
