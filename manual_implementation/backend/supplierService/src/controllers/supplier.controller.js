const mongoose = require('mongoose');
const Supplier = require('../models/supplier.model');
const fs = require('fs');
const path = require('path');

// Get server URL from environment or use default
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8006';

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    // Add full URL to logo paths
    const suppliersWithFullUrls = suppliers.map(supplier => ({
      ...supplier.toObject(),
      logo: supplier.logo ? `${SERVER_URL}${supplier.logo}` : null
    }));
    res.json(suppliersWithFullUrls);
  } catch (error) {
    console.error('Error getting suppliers:', error);
    res.status(500).json({ 
      message: 'Error getting suppliers',
      error: error.message
    });
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    // Add full URL to logo path
    const supplierWithFullUrl = {
      ...supplier.toObject(),
      logo: supplier.logo ? `${SERVER_URL}${supplier.logo}` : null
    };
    res.json(supplierWithFullUrl);
  } catch (error) {
    console.error('Error getting supplier:', error);
    res.status(500).json({ 
      message: 'Error getting supplier',
      error: error.message
    });
  }
};

const createSupplier = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Validate required fields
    const requiredFields = ['name', 'email', 'officePhoneNumber', 'address'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        fields: missingFields
      });
    }

    const supplierData = {
      name: req.body.name,
      email: req.body.email,
      officePhoneNumber: req.body.officePhoneNumber,
      address: req.body.address,
      isAct: req.body.isAct === 'true'
    };
    
    // Handle file upload
    if (req.file) {
      supplierData.logo = `/uploads/${req.file.filename}`;
    }

    const supplier = new Supplier(supplierData);
    const savedSupplier = await supplier.save();
    
    // Add full URL to logo path in response
    const supplierWithFullUrl = {
      ...savedSupplier.toObject(),
      logo: savedSupplier.logo ? `${SERVER_URL}${savedSupplier.logo}` : null
    };
    
    res.status(201).json(supplierWithFullUrl);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(400).json({ 
      message: 'Error creating supplier',
      error: error.message
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'email', 'officePhoneNumber', 'address'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        fields: missingFields
      });
    }

    const supplierData = {
      name: req.body.name,
      email: req.body.email,
      officePhoneNumber: req.body.officePhoneNumber,
      address: req.body.address,
      isAct: req.body.isAct === 'true'
    };
    
    // Handle file upload
    if (req.file) {
      supplierData.logo = `/uploads/${req.file.filename}`;

      // Delete old logo if exists
      const oldSupplier = await Supplier.findById(req.params.id);
      if (oldSupplier && oldSupplier.logo) {
        const oldLogoPath = path.join(__dirname, '../..', oldSupplier.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      supplierData,
      { new: true }
    );
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(400).json({ 
      message: 'Error updating supplier',
      error: error.message
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Delete logo file if exists
    if (supplier.logo) {
      const logoPath = path.join(__dirname, '../..', supplier.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ 
      message: 'Error deleting supplier',
      error: error.message
    });
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
}; 