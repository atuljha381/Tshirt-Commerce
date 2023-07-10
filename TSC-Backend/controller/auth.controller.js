const User = require("./../models/customer.model.js");
const catchAsync = require("./../utils/catchAsync.errors.js");
const AppError = require("./../utils/tsc.error.js");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
/**
 * This method is supposed to add the phone number to the Database after the phone number is verified
 */
exports.signupByPhoneNumber = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    phone: req.body.phone,
    password: req.body.password,
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.loginByPhoneNumber = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;

  //Check if Phone Number exists in the req body
  if (!phone) {
    return next(new AppError("Please provide Phone Number!", 400));
  }

  //Check if Phone Number exists in the DB
  const user = await User.findOne({ phone: phone }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //If everything OK send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
