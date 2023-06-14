const express = require("express");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, require: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
});

module.exports = Customer = mongoose.model("Customer", customerSchema);
