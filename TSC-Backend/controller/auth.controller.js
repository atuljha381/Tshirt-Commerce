const User = require("./../models/customer.model.js");
const sendEmail = require("./../utils/email.js");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync.errors.js");
const AppError = require("./../utils/tsc.error.js");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

const client = require("twilio")(
  process.env.PHONE_ACCOUNT_SID,
  process.env.PHONE_AUTH_TOKEN
);

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

exports.loginByPhoneOTP = catchAsync(async (req, res, next) => {
  client.verify
    .services(process.env.PHONE_SERVICE_SID)
    .verifications.create({
      to: `+91${req.body.phone}`,
      channel: "sms",
    })
    .then((data) => {
      res.status(200).json({
        status: "success",
        data,
      });
    });
});

exports.verifyOtpForPhoneNumber = catchAsync(async (req, res, next) => {
  client.verify
    .services(process.env.PHONE_SERVICE_SID)
    .verificationChecks.create({
      to: `+91${req.body.phone}`,
      code: req.body.code,
    })
    .then((data) => {
      res.status(200).json({
        status: "success",
        data,
      });
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user based on posted number/email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("No user found for the given number", 404));
  }

  //Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //Send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/auth/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password please ignore this mail`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email", 500));
  }
});

exports.resetPassword = (req, res, next) => {};
