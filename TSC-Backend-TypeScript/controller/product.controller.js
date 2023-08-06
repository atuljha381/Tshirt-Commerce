"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_model_1 = __importDefault(require("../models/customer.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const tsc_error_1 = __importDefault(require("../utils/tsc.error"));
const catchAsync_errors_1 = __importDefault(require("../utils/catchAsync.errors"));
class ProductControl {
    constructor() {
        this.getAllProducts = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const queryObj = Object.assign({}, req.query);
            const excludedFields = ["page", "sort", "limit", "fields"];
            excludedFields.forEach((el) => delete queryObj[el]);
            const query = product_model_1.default.find(queryObj);
            const allProducts = yield query;
            res.status(200).json({
                status: "success",
                result: allProducts.length,
                data: {
                    products: allProducts,
                },
            });
        }));
        this.getProductById = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const product = yield customer_model_1.default.findById(req.params.id);
            if (!product)
                return next(new tsc_error_1.default("The Product you are looking for does not exist", 404));
            res.status(200).json({
                status: "success",
                data: {
                    product: product,
                },
            });
        }));
        this.addProduct = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const newProduct = yield product_model_1.default.create(req.body);
            res.status(201).json({
                status: "success",
                data: {
                    product: newProduct,
                },
            });
        }));
        this.updateProductById = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const updatedProduct = yield product_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });
            if (!updatedProduct)
                return next(new tsc_error_1.default("The Product you are looking for does not exist", 404));
            res.status(201).json({
                status: "success",
                data: {
                    product: updatedProduct,
                },
            });
        }));
        this.deleteProductById = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const product = yield product_model_1.default.findByIdAndDelete(req.params.id);
            if (!product)
                return next(new tsc_error_1.default("The Product you are looking for does not exist", 404));
            res.status(204).json({
                status: "Deleted",
                data: {
                    product: null,
                },
            });
        }));
        this.addRatingsByProductId = (0, catchAsync_errors_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.productId;
            const { userId, rating, review } = req.body;
            const user = yield customer_model_1.default.findById(userId);
            if (!user)
                return next(new tsc_error_1.default("User not found", 404));
            const product = yield product_model_1.default.findById(productId);
            if (!product)
                return next(new tsc_error_1.default("Product does not exist", 404));
            product.ratings.push({
                user: userId,
                rating: rating,
                review: review,
            });
            yield product.save();
            res.status(200).json({
                status: "success",
                data: {
                    ratings: product.ratings,
                },
            });
        }));
    }
}
const product = new ProductControl();
exports.default = product;
