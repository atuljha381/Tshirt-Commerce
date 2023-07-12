/**
 * Import required Libraries and Model
 */
const Product = require("./../models/product.model");

const AppError = require("./../utils/tsc.error");
const catchAsync = require("./../utils/catchAsync.errors");

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  const query = Product.find(queryObj);
  const product = await query;

  res.status(201).json({
    status: "success",
    count: product.length,
    data: {
      product,
    },
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return next(new AppError("No product exists with the given id", 404));

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product)
    return next(new AppError("No product with the given id exists", 404));

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.deleteProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product)
    return next(new AppError("No product with the given id exists", 404));

  res.status(201).json({
    status: "success",
    data: {
      product: null,
    },
  });
});

// exports.uploadImageByMulter =  (req, res, next) => {
//   upload((req, res) => {
//     const newImage = new Product({
//       productImage: {
//         data: req.file.filename,
//         contentType: "image/jpg",
//       },
//     });
//     newImage.save().then(() =>
//       res.send(201).json({
//         status: "uploaded",
//       })
//     );
//   });
// };
