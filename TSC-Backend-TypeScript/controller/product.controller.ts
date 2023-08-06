import Customer from "../models/customer.model";
import Product from "../models/product.model";
import AppError from "../utils/tsc.error";
import catchAsync from "../utils/catchAsync.errors";

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
    const product = await Customer.findById(req.params.id);

    if (!product)
      return next(
        new AppError("The Product you are looking for does not exist", 404)
      );

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

    if (!updatedProduct)
      return next(
        new AppError("The Product you are looking for does not exist", 404)
      );

    res.status(201).json({
      status: "success",
      data: {
        product: updatedProduct,
      },
    });
  });

  deleteProductById = catchAsync(async (req: any, res: any, next: any) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return next(
        new AppError("The Product you are looking for does not exist", 404)
      );

    res.status(204).json({
      status: "Deleted",
      data: {
        product: null,
      },
    });
  });

  addRatingsByProductId = catchAsync(async (req: any, res: any, next: any) => {
    const productId = req.params.productId;
    const { userId, rating, review } = req.body;

    const user = await Customer.findById(userId);

    if (!user) return next(new AppError("User not found", 404));

    const product = await Product.findById(productId);

    if (!product) return next(new AppError("Product does not exist", 404));

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
}

const product = new ProductControl();
export default product;
