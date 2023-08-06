"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const product_controller_1 = __importDefault(require("../controller/product.controller"));
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
router
    .route("/")
    .get(auth_controller_1.default.protectRoute, product_controller_1.default.getAllProducts)
    .post(product_controller_1.default.addProduct);
router
    .route("/:id")
    .get(product_controller_1.default.getProductById)
    .patch(product_controller_1.default.updateProductById)
    .patch(product_controller_1.default.addRatingsByProductId)
    .delete(auth_controller_1.default.protectRoute, auth_controller_1.default.restrictTo("admin"), product_controller_1.default.deleteProductById);
exports.default = router;
