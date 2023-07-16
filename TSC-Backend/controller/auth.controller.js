const User = require("./../models/customer.model.js");
const { promisify } = require("util");
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

/**
 * Middleware for the purpose of Login
 */
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
  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
  });
});

/**
 * Middleware to protect routes using JWT 
 * Security measure to ensure the user with valid JWT is only allowed to view the page
 */
exports.protect = catchAsync(async (req, res, next) => {
  //Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log(token);

  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }

  //Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to the token no longer exists", 401)
    );
  }
  //Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please login again", 401)
    );
  }

  //Grant Access to protected route
  req.user = currentUser;
  next();
});

/**
 * Middleware to restrict deletion to admin only
 * @param  {...any} roles 
 * @returns error if the argument is not admin 
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};


exports.forgotPassword = (req,res,next) => {}
exports.resetPassword = (req,res,next) => {}