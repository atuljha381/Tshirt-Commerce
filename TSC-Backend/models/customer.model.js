/**
 * Customer Database Schema File
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    required: [true, "Please provide a mail"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This only works on CREATE and Save
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  address: { type: String, required: [true, "Address is required"] },
  city: { type: String, required: [true, "City is required"] },
  state: { type: String, required: [true, "State is required"] },
  country: { type: String, required: [true, "Country is required"] },
  pincode: { type: String, required: [true, "pincode is required"] },
});

customerSchema.pre("save", (next) => {
  //Only run this function if password was actually modified
  if (!this.isModified(password)) return next();

  //Hash the password with the cost of 12
  this.password = bcrypt.hash(this.password, 12);

  /**
   * Delete password confirm field because validation done
   * Or Validate the confirm password from the frontend if possible
   */
  this.passwordConfirm = undefined;
  next();
});

module.exports = Customer = mongoose.model("Customer", customerSchema);
/**
 * Also can write as:
 * const customer = mongoose.model("Customer", customerSchema);
 * module.exports = customer
 */
