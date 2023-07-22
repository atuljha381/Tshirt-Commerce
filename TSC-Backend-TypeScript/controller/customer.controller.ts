/**
 * Imported Customer Schema
 */
import AppError from "../utils/tsc.error";
import Customer from "../models/customer.model";
import catchAsync = require("../utils/catchAsync.errors");

class CustControl {
  /**
   * Method to Add Customer data to Mongo Database
   */
  createCustomerById = async (req: any, res: any, next: any) => {
    const newCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true }
    );

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
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = Customer.find(queryObj);

    //Execute Query
    const newCustomer = await query;

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
    const newCustomer = await Customer.findById(req.params.id);

    if (!newCustomer) {
      return next(new AppError("No customer with the given ID exists", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        customer: newCustomer,
      },
    });
  };

  /**
   *
   * @param {id} req.params.id
   * @param {body} req.body
   * Method to Update Customer Data By ID
   */
  updateCustomerById = async (req: any, res: any, next: any) => {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCustomer) {
      return next(new AppError("No customer with the given ID exists", 404));
    }

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
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return next(new AppError("No customer with the given ID exists", 404));
    }

    res.status(204).json({
      status: "Successfully Deleted",
      customer: null,
    });
  };
}

const customer = new CustControl();
export default customer;
