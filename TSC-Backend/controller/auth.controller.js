const User = require("./../models/customer.model.js");
const catchAsync = require("./../utils/catchAsync.errors.js")
const jwt = require("jsonwebtoken");

/**
 * This method is supposed to add the phone number to the Database after the phone number is verified
 */
exports.signUpByPhoneNumber = catchAsync( async (req, res, next) => {
    const newUser = await User.create({
      phone: req.body.phone,
    });
    const token = jwt.sign({ id: newUser.phone }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
});


