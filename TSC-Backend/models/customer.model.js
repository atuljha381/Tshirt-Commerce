/**
 * Customer Database Schema File
 */

const mongoose = require("mongoose");

/**
 * Defining the Customer Schema
 */
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, require: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
});

module.exports = Customer = mongoose.model("Customer", customerSchema);
/**
 * Also can write as:
 * const customer = mongoose.model("Customer", customerSchema);
 * module.exports = customer
 */