const Customer = require('../models/customer.model');

class CustomerService {
  // Create a new customer
  async createCustomer(customerData) {
    try {
      return await Customer.create(customerData);
    } catch (error) {
      // Handle duplicate email error
      if (error.code === 11000) {
        const customError = new Error('Email already exists');
        customError.statusCode = 409;
        throw customError;
      }
      throw error;
    }
  }

  // Add this method to delete old photo when updating
  async deleteCustomerPhoto(photoPath) {
    if (!photoPath) return;
    
    try {
      // Get absolute path
      const absolutePath = path.join(__dirname, '../', photoPath);
      
      // Check if file exists and is within uploads directory
      if (fs.existsSync(absolutePath) && absolutePath.includes('uploads')) {
        fs.unlinkSync(absolutePath);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      // Continue despite errors - don't stop the flow
    }
  }

  // Update the existing updateCustomer method to handle photo deletion:
  async updateCustomer(id, customerData) {
    try {
      // Find the existing customer to potentially delete old photo
      const existingCustomer = await Customer.findById(id);
      
      if (!existingCustomer) {
        const error = new Error('Customer not found');
        error.statusCode = 404;
        throw error;
      }
      
      // If updating with a new photo and old photo exists, delete the old one
      if (customerData.photo && existingCustomer.photo && customerData.photo !== existingCustomer.photo) {
        await this.deleteCustomerPhoto(existingCustomer.photo);
      }
      
      const customer = await Customer.findByIdAndUpdate(
        id,
        customerData,
        { new: true, runValidators: true }
      );

      return customer;
    } catch (error) {
      // Handle duplicate email error
      if (error.code === 11000) {
        const customError = new Error('Email already exists');
        customError.statusCode = 409;
        throw customError;
      }
      throw error;
    }
  }

  // Also update deleteCustomer to remove the photo
  async deleteCustomer(id) {
    const customer = await Customer.findById(id);
    
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Delete customer photo if exists
    if (customer.photo) {
      await this.deleteCustomerPhoto(customer.photo);
    }
    
    await customer.deleteOne();
    return customer;
  }

  // Get all customers with pagination and sorting
  async getAllCustomers(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortField = query.sortField || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const search = query.search || '';

    let queryObj = {};
    if (search) {
      queryObj = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const sort = {};
    sort[sortField] = sortOrder;

    const customers = await Customer.find(queryObj)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(queryObj);

    return {
      data: customers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get a customer by ID
  async getCustomerById(id) {
    const customer = await Customer.findById(id);
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    return customer;
  }
}

module.exports = new CustomerService();