/**
 * Customer Database Schema File
 */

const mongoose = require("mongoose");

/**
 * Defining the Customer Schema
 */
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "First Name is required"] },
  lastName: { type: String, required: [true, "Last Name is required"] },
  phone: {
    type: Number,
    require: [true, "Phone Number is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  // password:{
  //   type: String,
  //   required: [true, "Password is required"],
  //   minLength: [5],
  // },
  address: { type: String, required: [true, "Address is required"] },
  city: { type: String, required: [true, "City is required"] },
  state: { type: String, required: [true, "State is required"] },
  country: { type: String, required: [true, "Country is required"] },
  pincode: { type: String, required: [true, "pincode is required"] },
});

module.exports = Customer = mongoose.model("Customer", customerSchema);
/**
 * Also can write as:
 * const customer = mongoose.model("Customer", customerSchema);
 * module.exports = customer
 */
