const customerService = require('../services/customer.service');

class CustomerController {
  async createCustomer(req, res, next) {
    try {
      // Create customer data object
      const customerData = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        transactions: req.body.transactions,
      };
      
      // If a file was uploaded, add the path
      if (req.file) {
        customerData.photo = `/uploads/${req.file.filename}`;
      }
      
      const customer = await customerService.createCustomer(customerData);
      res.status(201).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }
  
  async updateCustomer(req, res, next) {
  try {
    const customerData = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      transactions: req.body.transactions,
    };

    // If a file was uploaded, add the path
    if (req.file) {
      customerData.photo = `/uploads/${req.file.filename}`;
    }

    // Only update photo if explicitly included
    if (Object.prototype.hasOwnProperty.call(req.body, 'photo')) {
      customerData.photo = req.body.photo;
    }

    const customer = await customerService.updateCustomer(req.params.id, customerData);
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
}


  // Get all customers
  async getAllCustomers(req, res, next) {
    try {
      const result = await customerService.getAllCustomers(req.query);
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a single customer by ID
  async getCustomerById(req, res, next) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a customer
  async deleteCustomer(req, res, next) {
    try {
      await customerService.deleteCustomer(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();