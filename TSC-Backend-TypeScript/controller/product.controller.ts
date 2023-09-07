import Customer from "../models/customer.model";
import Product from "../models/product.model";
import AppError from "../utils/tsc.error";
import catchAsync from "../utils/catchAsync.errors";
import logger from "../middleware/logger";
import { error } from "winston";

const PRODUCT_NOT_FOUND: String =
  "The Product you are looking for does not exist";
class ProductControl {
  getAllProducts = catchAsync(async (req: any, res: any, next: any) => {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = Product.find(queryObj);

    const allProducts = await query;

    res.status(200).json({
      status: "success",
      result: allProducts.length,
      data: {
        products: allProducts,
      },
    });
  });

  getProductById = catchAsync(async (req: any, res: any, next: any) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new AppError(PRODUCT_NOT_FOUND, 404));

    res.status(200).json({
      status: "success",
      data: {
        product: product,
      },
    });
  });

  addProduct = catchAsync(async (req: any, res: any, next: any) => {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  });

  updateProductById = catchAsync(async (req: any, res: any, next: any) => {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) return next(new AppError(PRODUCT_NOT_FOUND, 404));

    res.status(201).json({
      status: "success",
      data: {
        product: updatedProduct,
      },
    });
  });

  deleteProductById = catchAsync(async (req: any, res: any, next: any) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return next(new AppError(PRODUCT_NOT_FOUND, 404));

    res.status(204).json({
      status: "Deleted",
      data: {
        product: null,
      },
    });
  });

  addRatingsByProductId = catchAsync(async (req: any, res: any, next: any) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) return next(new AppError(PRODUCT_NOT_FOUND, 404));

    const { userId, rating, review } = req.body;

    const user = await Customer.findById(userId);

    if (!user) return next(new AppError("User does not exist", 404));

    product.ratings.push({
      user: userId,
      rating: rating,
      review: review,
    });

    await product.save();

    res.status(200).json({
      status: "success",
      data: {
        ratings: product.ratings,
      },
    });
  });

  buyingProduct = catchAsync(async (req: any, res: any, next: any) => {
    const product = await Product.findById(req.params.id);
    const quantity = req.body.quantity;

    if (!product) return next(new AppError(PRODUCT_NOT_FOUND, 404));

    product.stock = product.stock - quantity;

    await product.save();

    res.status(200).json({
      status: "Stock changed",
      data: {
        product: product.stock,
      },
    });
  });

  uploadSingleImage = (req: any, res: any, next: any) => {
    if (!req.file) {
      return next(new AppError("No image uploaded", 400));
    }

    res.status(200).json({
      status: "Image Uploaded",
      name: req.file.filename,
    });
  };
}

const product = new ProductControl();
export default product;
