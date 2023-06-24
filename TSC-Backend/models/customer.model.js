/**
 * Customer Database Schema File
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const query = {};
/**
 * Defining the Customer Schema
 */
const customerSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  phone: {
    type: String,
    unique: true,
    required: [true, "Phone number required"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },

  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
});

module.exports = Customer = mongoose.model("Customer", customerSchema);
/**
 * Also can write as:
 * const customer = mongoose.model("Customer", customerSchema);
 * module.exports = customer
 */
