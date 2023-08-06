"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Import necessary modules and dependencies
 */
const tsc_error_1 = __importDefault(require("../utils/tsc.error"));
const customer_model_1 = __importDefault(require("../models/customer.model"));
class CustControl {
    constructor() {
        /**
         * Method to Add Customer data to Mongo Database
         */
        this.createCustomerById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Find customer by ID and update with the data from the request body
            const newCustomer = yield customer_model_1.default.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
            // Send a success response indicating that the customer data has been added
            res.status(201).json({
                status: "Successfully Added",
                data: {
                    customer: newCustomer,
                },
            });
        });
        /**
         * Method to get all Customer Data
         */
        this.getAllCustomers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Extract query parameters from the request and remove excluded fields
            const queryObj = Object.assign({}, req.query);
            const excludedFields = ["page", "sort", "limit", "fields"];
            excludedFields.forEach((el) => delete queryObj[el]);
            // Create a query to find customers based on the query parameters
            const query = customer_model_1.default.find(queryObj);
            // Execute the query to get all customer data
            const newCustomer = yield query;
            // Send a success response with the customer data
            res.status(200).json({
                status: "success",
                results: newCustomer.length,
                data: {
                    customer: newCustomer,
                },
            });
        });
        /**
         * @param {id} req.param.id
         * Method to get Customer data by Id
         */
        this.getCustomerById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Find customer by ID
            const newCustomer = yield customer_model_1.default.findById(req.params.id);
            // If no customer is found with the given ID, send a 404 error response
            if (!newCustomer) {
                return next(new tsc_error_1.default("No customer with the given ID exists", 404));
            }
            // Send a success response with the customer data
            res.status(200).json({
                status: "success",
                data: {
                    customer: newCustomer,
                },
            });
        });
        /**
         * @param {id} req.params.id
         * @param {body} req.body
         * Method to Update Customer Data By ID
         */
        this.updateCustomerById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Find customer by ID and update with the data from the request body
            const updatedCustomer = yield customer_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });
            // If no customer is found with the given ID, send a 404 error response
            if (!updatedCustomer) {
                return next(new tsc_error_1.default("No customer with the given ID exists", 404));
            }
            // Send a success response indicating that the customer data has been updated
            res.status(200).json({
                status: "Successfully Updated",
                data: {
                    customer: updatedCustomer,
                },
            });
        });
        /**
         * @param {id} req.params.id
         * Method to delete Customer Data by Id
         */
        this.deleteCustomerById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Find customer by ID and delete it
            const customer = yield customer_model_1.default.findByIdAndDelete(req.params.id);
            // If no customer is found with the given ID, send a 404 error response
            if (!customer) {
                return next(new tsc_error_1.default("No customer with the given ID exists", 404));
            }
            // Send a success response indicating that the customer data has been deleted
            res.status(204).json({
                status: "Successfully Deleted",
                customer: null,
            });
        });
    }
}
const customer = new CustControl();
exports.default = customer;
