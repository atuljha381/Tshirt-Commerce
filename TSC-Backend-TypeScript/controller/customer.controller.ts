/**
 * Import necessary modules and dependencies
 */
import AppError from "../utils/tsc.error";
import Customer from "../models/customer.model";
import catchAsync = require("../utils/catchAsync.errors");

class CustControl {
  /**
   * Method to Add Customer data to Mongo Database
   */
  createCustomerById = async (req: any, res: any, next: any) => {
    // Find customer by ID and update with the data from the request body
    const newCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true }
    );

    // Send a success response indicating that the customer data has been added
    res.status(201).json({
      status: "Successfully Added",
      data: {
        customer: newCustomer,
      },
    });
  };

  /**
   * Method to get all Customer Data
   */
  getAllCustomers = async (req: any, res: any, next: any) => {
    // Extract query parameters from the request and remove excluded fields
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Create a query to find customers based on the query parameters
    const query = Customer.find(queryObj);

    // Execute the query to get all customer data
    const newCustomer = await query;

    // Send a success response with the customer data
    res.status(200).json({
      status: "success",
      results: newCustomer.length,
      data: {
        customer: newCustomer,
      },
    });
  };

  /**
   * @param {id} req.param.id
   * Method to get Customer data by Id
   */
  getCustomerById = async (req: any, res: any, next: any) => {
    // Find customer by ID
    const newCustomer = await Customer.findById(req.params.id);

    // If no customer is found with the given ID, send a 404 error response
    if (!newCustomer) {
      return next(new AppError("No customer with the given ID exists", 404));
    }

    // Send a success response with the customer data
    res.status(200).json({
      status: "success",
      data: {
        customer: newCustomer,
      },
    });
  };

  /**
   * @param {id} req.params.id
   * @param {body} req.body
   * Method to Update Customer Data By ID
   */
  updateCustomerById = async (req: any, res: any, next: any) => {
    // Find customer by ID and update with the data from the request body
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // If no customer is found with the given ID, send a 404 error response
    if (!updatedCustomer) {
      return next(new AppError("No customer with the given ID exists", 404));
    }

    // Send a success response indicating that the customer data has been updated
    res.status(200).json({
      status: "Successfully Updated",
      data: {
        customer: updatedCustomer,
      },
    });
  };

  /**
   * @param {id} req.params.id
   * Method to delete Customer Data by Id
   */
  deleteCustomerById = async (req: any, res: any, next: any) => {
    // Find customer by ID and delete it
    const customer = await Customer.findByIdAndDelete(req.params.id);

    // If no customer is found with the given ID, send a 404 error response
    if (!customer) {
      return next(new AppError("No customer with the given ID exists", 404));
    }

    // Send a success response indicating that the customer data has been deleted
    res.status(204).json({
      status: "Successfully Deleted",
      customer: null,
    });
  };
}

const customer = new CustControl();
export default customer;
