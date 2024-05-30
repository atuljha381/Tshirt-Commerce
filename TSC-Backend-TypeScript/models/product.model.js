"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define schema for 'Product' collection
const productSchema = new mongoose_1.Schema({
    // Product name
    productName: {
        type: String,
        required: true,
        trim: true, // Trim whitespace
    },
    // Product description
    productDescription: {
        type: String,
        required: true,
        trim: true, // Trim whitespace
    },
    // Product price
    productPrice: {
        type: String,
        required: true, // Required
    },
    //Product type
    productType: {
        type: String,
        required: true,
    },
    // Ratings array (nested objects)
    ratings: [
        {
            user: { type: mongoose_1.Types.ObjectId, ref: "Customer" },
            rating: { type: Number, min: 1, max: 5 },
            review: String, // Review text
        },
    ],
    // Stock quantity
    stock: {
        type: Number,
        default: 0,
        min: 0, // Minimum value: 0
    },
    // Product images array
    productImages: [String],
    // Automatic timestamps (createdAt and updatedAt)
}, { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);
// Create mongoose model 'Product'
const Product = (0, mongoose_1.model)("Product", productSchema);
// Export 'Product' model
exports.default = Product;
