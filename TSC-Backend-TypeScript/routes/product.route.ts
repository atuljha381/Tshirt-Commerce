import express from "express";
var router = express.Router();
import product from "../controller/product.controller";
import authController from "../controller/auth.controller";
import upload from "../middleware/multer";

router
  .route("/")
  .get(authController.protectRoute, product.getAllProducts)
  .post(product.addProduct);

router.route("/rating/:id").patch(product.addRatingsByProductId);
router.route("/buy/:id").patch(product.buyingProduct);
router.post("/image", upload.single("image"), product.uploadSingleImage);

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
