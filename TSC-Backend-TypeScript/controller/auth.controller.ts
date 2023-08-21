/**
 * Import necessary modules and dependencies
 */
import User from "./../models/customer.model";
import { sendOtpToPhoneNumber, verifyOTP } from "./../utils/phone";
import sendEmail from "./../utils/email";
import crypto from "crypto";
import catchAsync from "./../utils/catchAsync.errors";
import AppError from "./../utils/tsc.error";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import logger from "../middleware/logger";
dotenv.config();

// Get the JWT secret and expiry from environment variables
const JWT_SECRET: any = process.env.JWT_SECRET;
const JWT_EXPIRY: any = process.env.JWT_EXPIRY;

// Define the Authentication Controller class
class AuthControl {
  private signToken = (id: any) => {
    return jwt.sign({ id: id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
  };

  /**
   * Route to signup a user using their phone number
   * This method adds the phone number to the Database after verifying it
   */
  signupByPhoneNumberRoute = catchAsync(
    async (req: any, res: any, next: any) => {
      // Create a new user in the database with the provided phone number and password
      const newUser = await User.create({
        phone: req.body.phone,
        password: req.body.password,
      });

      // Generate a JWT token for the new user's ID
      const token = this.signToken(newUser._id);

      // Send a success response with the JWT token and user data to the client
      res.status(201).json({
        status: "success",
        token,
        data: {
          user: newUser,
        },
      });
    }
  );

  /**
   * Middleware for handling user login using phone number and password
   */
  loginByPhoneNumberRoute = catchAsync(
    async (req: any, res: any, next: any) => {
      const { phone, password } = req.body;

      // Check if Phone Number exists in the request body
      if (!phone) {
        // If phone number is not provided, log an error and return a 400 Bad Request error
        logger.error("Please provide Phone Number!");
        return next(new AppError("Please provide Phone Number!", 400));
      }

      // Check if Phone Number exists in the database
      const user: any = await User.findOne({ phone: phone }).select(
        "+password"
      );

      // If the user doesn't exist or the provided password is incorrect, return a 401 Unauthorized error
      if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect phone number or password", 401));
      }

      // If everything is correct, generate a JWT token for the user's ID
      const token = this.signToken(user.id);

      // Send a success response with the JWT token to the client
      res.status(200).json({
        status: "success",
        token,
      });
    }
  );

  /**
   * Middleware for sending an OTP to a phone number
   */
  sendOtpToPhoneRoute = catchAsync(async (req: any, res: any, next: any) => {
    // Call the sendOtpToPhoneNumber function to send the OTP to the provided phone number
    await sendOtpToPhoneNumber(req.body.phone, req.body.channel);

    // Respond with a success status (HTTP 200 OK) indicating that the OTP was sent successfully
    res.status(200).json({
      status: "success",
    });
  });

  /**
   * Middleware for verifying an OTP for a phone number
   */
  verifyOtpForPhoneRoute = catchAsync(async (req: any, res: any, next: any) => {
    // Call the verifyOTP function to verify the OTP for the provided phone number
    await verifyOTP(req.body.phone, req.body.otp);

    // Respond with a success status (HTTP 200 OK) indicating that the OTP was successfully verified
    res.status(200).json({
      status: "success",
    });
  });

  /**
   * Middleware to protect routes using JWT
   * Security measure to ensure the user with valid JWT is only allowed to view the page
   */
  protectRoute = catchAsync(async (req: any, res: any, next: any) => {
    // Getting the JWT token from the request headers and checking if it's present
    let token: any;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If token is missing, return a 401 Unauthorized error
    if (!token) {
      return next(new AppError("You are not logged in!", 401));
    }

    // Verify the authenticity of the token
    const decoded: any = await jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return next(new AppError("You are not logged in!", 401));
    }

    // Check if the user associated with the token still exists in the database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to the token no longer exists", 401)
      );
    }
    // Check if the user changed the password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError("User recently changed password! Please login again", 401)
      );
    }

    // Grant access to the protected route by attaching the user object to the request
    req.user = currentUser;
    next();
  });

  /**
   * Middleware to restrict access to specific roles only (e.g., admin)
   * @param {...any} roles - Array of roles that are allowed to access the route
   * @returns If the user role is not in the allowed roles, an error is returned
   */
  restrictTo = (...roles: any) => {
    return (req: any, res: any, next: any) => {
      // Check if the user's role is included in the allowed roles
      if (!roles.includes(req.user.userRole)) {
        // If the user's role is not allowed, return a 403 Forbidden error
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
      // If the user's role is allowed, proceed to the next middleware or route handler
      next();
    };
  };

  /**
   * Middleware for handling the "forgot password" functionality
   */
  forgotPasswordRoute = catchAsync(async (req: any, res: any, next: any) => {
    // Get the user based on the email provided in the request body
    const user = await User.findOne({ email: req.body.email });

    // If no user is found with the provided email, return a 404 Not Found error
    if (!user) {
      return next(new AppError("No user found for the given email", 404));
    }

    // Generate a random password reset token and save it to the user's document
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Construct the URL for the password reset page using the reset token
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/auth/reset-password/${resetToken}`;

    // Compose the email message to be sent to the user
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email.`;

    try {
      // Send the password reset email to the user's email address
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 minutes)",
        message,
      });

      // Respond with a success status (HTTP 200 OK) and a message indicating that the reset token was sent to the user's email
      res.status(200).json({
        status: "success",
        message: "Token sent to email",
      });
    } catch (err) {
      // If there was an error sending the email, reset the user's password reset token and expiration date and save the changes
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      // Return a 500 Internal Server Error with a message indicating the email sending failure
      return next(new AppError("There was an error sending the email", 500));
    }
  });

  /**
   * Middleware for resetting the user's password using the provided reset token
   */
  resetPasswordRoute = catchAsync(async (req: any, res: any, next: any) => {
    // Get the user based on the reset token sent as a URL parameter
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // If the token is invalid or has expired, return a 400 Bad Request error
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    // Set the new password for the user and clear the password reset token and expiration date
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the user in by signing a new JWT token and send it as a response
    const token = this.signToken(user.id);
    res.status(200).json({
      status: "success",
      token,
    });
  });

  isTokenValid = catchAsync(async (req: any, res: any, next: any) => {
    let token: any;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    const decoded: any = await jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return next(new AppError("You are not verified", 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User does not exist", 401));
    }

    res.status(200).json({
      status: "success",
      displayName: user.firstName + "" + user.lastName,
      id: user.id,
    });
  });
}

// Create an instance of the AuthControl class and export it
const authController = new AuthControl();
export default authController;
