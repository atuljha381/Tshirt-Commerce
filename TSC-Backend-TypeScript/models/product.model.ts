import mongoose, { model, Schema, Types } from "mongoose";

// Define schema for 'Product' collection
const productSchema = new Schema(
  {
    // Product name
    productName: {
      type: String,
      required: true, // Required
      trim: true, // Trim whitespace
    },

    // Product description
    productDescription: {
      type: String,
      required: true, // Required
      trim: true, // Trim whitespace
    },

    // Product price
    productPrice: {
      type: Number,
      required: true, // Required
      min: 0, // Minimum value: 0
    },

    // Ratings array (nested objects)
    ratings: [
      {
        user: { type: Types.ObjectId, ref: "Customer" }, // Reference to 'Customer' using ObjectId
        rating: { type: Number, min: 1, max: 5 }, // Rating: 1 to 5
        review: String, // Review text
      },
    ],

    // Stock quantity
    stock: {
      type: Number,
      default: 0, // Default: 0
      min: 0, // Minimum value: 0
    },

    // Category
    category: String,

    // Product images array
    productImages: [String],

    // Automatic timestamps (createdAt and updatedAt)
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create mongoose model 'Product'
const Product = model("Product", productSchema);

// Export 'Product' model
export default Product;
