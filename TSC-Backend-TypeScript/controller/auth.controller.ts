import User from "./../models/customer.model";
import { sendOtpToPhoneNumber, verifyOTP } from "./../utils/phone";
import sendEmail from "./../utils/email";
import { promisify } from "util";
import catchAsync from "./../utils/catchAsync.errors";
import AppError from "./../utils/tsc.error";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET: any = process.env.JWT_SECRET;
const JWT_EXPIRY: any = process.env.JWT_EXPIRY;

class AuthControl {
  private signToken = (id: any) => {
    return jwt.sign({ id: id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
  };

  /**
   * This method is supposed to add the phone number to the Database after the phone number is verified
   */
  signupByPhoneNumberRoute = async (req: any, res: any, next: any) => {
    const newUser = await User.create({
      phone: req.body.phone,
      password: req.body.password,
    });
    const token = this.signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  };

  /**
   * Middleware for the purpose of Login
   */
  loginByPhoneNumberRoute = async (req: any, res: any, next: any) => {
    const { phone, password } = req.body;

    //Check if Phone Number exists in the req body
    if (!phone) {
      return next(new AppError("Please provide Phone Number!", 400));
    }

    //Check if Phone Number exists in the DB
    const user: any = await User.findOne({ phone: phone }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    //If everything OK send token to client
    const token = this.signToken(user.id);
    res.status(200).json({
      status: "success",
      token,
    });
  };

  sendOtpToPhoneRoute = async (req: any, res: any, next: any) => {
    await sendOtpToPhoneNumber(req.body.phone, req.body.channel);
    res.status(200).json({
      status: "success",
    });
  };

  verifyOtpForPhoneRoute = async (req: any, res: any, next: any) => {
    await verifyOTP(req.body.phone, req.body.otp);
    res.status(200).json({
      status: "success",
    });
  };

  /**
   * Middleware to protect routes using JWT
   * Security measure to ensure the user with valid JWT is only allowed to view the page
   */
  protectRoute = async (req: any, res: any, next: any) => {
    //Getting token and check if it's there
    let token: any;
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
    // const decoded: any = await promisify(jwt.verify(token, JWT_SECRET);
    const decoded: any = await jwt.verify(token, JWT_SECRET);

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
  };

  /**
   * Middleware to restrict deletion to admin only
   * @param  {...any} roles
   * @returns error if the argument is not admin
   */
  restrictTo = (...roles: any) => {
    return (req: any, res: any, next: any) => {
      if (!roles.includes(req.user.userRole)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
      next();
    };
  };

  forgotPasswordRoute = async (req: any, res: any, next: any) => {
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
  };

  resetPasswordRoute = (req: any, res: any, next: any) => {};
}

const authController = new AuthControl();
export default authController;
