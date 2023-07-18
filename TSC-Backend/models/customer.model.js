/**
 * Customer Database Schema File
 */
const crypto = require("crypto");
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
  userRole: {
    type: String,
    enum: ["admin", "consumer", "seller"],
    default: "consumer",
  },
  password: {
    type: String,
    minLength: 8,
    required: [true, "Please provide a password"],
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pincode: { type: String },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

/**
 * Encrypting the password before saving into the database
 */
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  //this.passwordConfirm = undefined

  next();
});

/**
 * Checking if the password is correct
 * @param {*} candidatePassword
 * @param {*} userPassword
 * @returns
 */
customerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Checks if the password was changed while the JWT token was active
 * @param {JWTTimeStamp} It is the time the JWT was issued
 * @returns false if not changed
 */
customerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

customerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //For(Minutes) * For(Seconds) * For(Milliseconds)
  return resetToken;
};

module.exports = Customer = mongoose.model("Customer", customerSchema);
/**
 * Also can write as:
 * const customer = mongoose.model("Customer", customerSchema);
 * module.exports = customer
 */
