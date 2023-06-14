const Customer = require("./../models/customer.model");

exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        customer: newCustomer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customer = await Customer.find();

    res.status(200).json({
      status: "success",
      results: customer.length,
      data: {
        customer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        customer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
