const User = require("./../models/customer.model.js");

/**
 * This method is supposed to add the phone number to the Database after the phone number is verified
 */
exports.loginByPhoneNumber = async (req, res) => {
  try {
    const newUser = await User.create({
      phone: req.body.phone
    });

    res.status(201).json({
      status: "success",
      data: {
        customer: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failure",
      responseText: err.message,
    });
  }
};
