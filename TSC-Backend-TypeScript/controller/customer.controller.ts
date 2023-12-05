/**
 * Import necessary modules and dependencies
 */
import AppError from "../utils/tsc.error";
import Customer from "../models/customer.model";
import catchAsync = require("../utils/catchAsync.errors");

class CustControl {
  USER_NOT_FOUND: String = "No customer with the given ID exists";
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
    const allCustomer = await query;

    // Send a success response with the customer data
    res.status(200).json({
      status: "success",
      results: allCustomer.length,
      data: {
        customer: allCustomer,
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
      return next(new AppError(this.USER_NOT_FOUND, 404));
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
      return next(new AppError(this.USER_NOT_FOUND, 404));
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
      return next(new AppError(this.USER_NOT_FOUND, 404));
    }

    // Send a success response indicating that the customer data has been deleted
    res.status(204).json({
      status: "Successfully Deleted",
      customer: null,
    });
  };

  addAddressForCustomer = catchAsync(async (req: any, res: any, next: any) => {
    const user = await Customer.findById(req.params.id);

    if (!user) return new AppError(this.USER_NOT_FOUND, 404);
    const {
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
    } = req.body.Address;
    
    user.Address.push({
      customerPhone: customerPhone,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
    });

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        address: user.Address,
      },
    });
  });
}

const customer = new CustControl();
export default customer;
