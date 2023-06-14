const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
});

module.exports = Customer = mongoose.model("customer", customerSchema);
