const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Enter Product Name"],
    unique: true,
  },
  productPrice: { type: Number, required: [true, "Enter Product Price"] },
  productDescription: {
    type: String,
    required: [true, "Enter Product Description"],
  },
  productRating: {
    type: Number,
    default: 4,
  },
  productImage: {
    data: Buffer,
    contentType: String,
  },
  createdAt: {
    type: Date,
  },
  modifiedAt: {
    type: Date,
  },
});

module.exports = Product = mongoose.model("Product", productSchema);
