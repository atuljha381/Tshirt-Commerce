/**
 * Imported Customer Schema
 */
const Customer = require("./../models/customer.model");

/**
 * Method to Add Customer data to Mongo Database
 */
exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);

    res.status(201).json({
      status: "Successfully Added",
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

/**
 * Method to get all Customer Data
 */
exports.getAllCustomers = async (req, res) => {
  try {
    const newCustomer = await Customer.find();

    res.status(200).json({
      status: "success",
      results: newCustomer.length,
      data: {
        customer: newCustomer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      err,
    });
  }
};

/**
 * @param {id} req.param.id
 * Method to get Customer data by Id
 */
exports.getCustomerById = async (req, res) => {
  try {
    const newCustomer = await Customer.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        customer: newCustomer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

/**
 *
 * @param {id} req.params.id
 * @param {body} req.body
 * Method to Update Customer Data By ID
 */
exports.updateCustomerById = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "Successfully Updated",
      data: {
        customer: updatedCustomer,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: err,
    });
  }
};

/**
 * 
 * @param {id} req.params.id
 * Method to delete Customer Data by Id
 */
exports.deleteCustomerById = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "Successfully Deleted",
      customer: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      responseText: err.message,
    });
    console.log(err);
  }
};
