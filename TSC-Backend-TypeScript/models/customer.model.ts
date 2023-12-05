/*
 * Customer Database Schema File
 * Import necessary modules and packages
 */
import crypto from "crypto";
import mongoose, { model, InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import logger from "../middleware/logger";

const query = {};

/**
 * Defining the Customer Schema
 */
const customerSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  displayName: { type: String },
  phone: {
    type: String,
    unique: true,
    // required: [true, "Phone number required"],
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
  Address: [
    {
      customerPhone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: String },
    },
  ],
  passwordResetToken: String,
  passwordResetExpires: Date,
});

customerSchema.pre("save", function (next) {
  this.displayName = this.firstName + " " + this.lastName;
  next();
});

/**
 * To ensure that token is always created after the password has been changed
 * Middleware to update the passwordChangedAt field when the password is modified or a new password is created.
 */
customerSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) return next();

  const oneSecondAgoTimestamp = Date.now() - 1000;
  this.passwordChangedAt = new Date(oneSecondAgoTimestamp);
  next();
});

/**
 * Encrypting the password before saving into the database
 * Middleware to hash the password before saving it to the database.
 */
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  let pswrd: any = this.password;
  this.password = await bcrypt.hash(pswrd, 12);
  // this.passwordConfirm = undefined

  next();
});

/**
 * Checking if the password is correct
 * Method to compare the candidate password with the user's stored hashed password.
 * @param {*} candidatePassword - The password provided by the user during login.
 * @param {*} userPassword - The hashed password stored in the database.
 * @returns {boolean} - True if the candidate password matches the user's password, false otherwise.
 */
customerSchema.methods.correctPassword = async function (
  candidatePassword: any,
  userPassword: any
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Checks if the password was changed while the JWT token was active
 * Method to check if the user's password was changed after the JWT token was issued.
 * @param {JWTTimeStamp} JWTTimestamp - The time the JWT was issued.
 * @returns {boolean} - True if the password was changed after the JWT token was issued, false otherwise.
 */
customerSchema.methods.changedPasswordAfter = function (JWTTimestamp: any) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = Math.ceil(this.passwordChangedAt.getTime() / 1000);

    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

/**
 * Method to create a password reset token for the user
 * Generates a random token, hashes it, and stores it in the passwordResetToken field of the user.
 * It also sets the passwordResetExpires field to the current time plus 10 minutes.
 * @returns {string} - The generated password reset token.
 */
customerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  logger.log(resetToken, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // For(Minutes) * For(Seconds) * For(Milliseconds)
  return resetToken;
};

// Declare the ICustomer interface to provide typings for the customerSchema
declare interface ICustomer extends InferSchemaType<typeof customerSchema> {
  correctPassword(correctPassword: string, userPassword: string): boolean;
  changedPasswordAfter(password: string): boolean;
  createPasswordResetToken(): string;
}

// Create the Customer model using the customerSchema
var Customer = model<ICustomer>("Customer", customerSchema);
export default Customer;

/**
 * Also can write as:
 * const customer = mongoose.model("Customer", customerSchema);
 * module.exports = customer
 */
