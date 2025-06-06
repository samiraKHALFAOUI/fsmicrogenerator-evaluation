const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { customerValidationRules, validate } = require('../middleware/validation.middleware');
const upload = require('../config/upload');

// Create a new customer - update with upload.single middleware
router.post(
  '/',
  validate,
  customerValidationRules(),
  upload.single('photo'),
  customerController.createCustomer
);

// Update a customer - update with upload.single middleware
router.put(
  '/:id',
  validate,
  customerValidationRules(),
  upload.single('photo'),
  customerController.updateCustomer
);

// Get all customers
router.get('/', customerController.getAllCustomers);

// Get a single customer by ID
router.get('/:id', customerController.getCustomerById);

// Delete a customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
