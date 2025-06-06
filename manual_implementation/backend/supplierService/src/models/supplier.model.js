const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  logo: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  officePhoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  isAct: {
    type: Boolean,
    default: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Supplier', supplierSchema); 