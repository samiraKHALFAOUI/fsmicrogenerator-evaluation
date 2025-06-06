const express = require('express');
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplier.controller');
const upload = require('../config/upload');

const router = express.Router();

router.get('/', getSuppliers);
router.get('/:id', getSupplier);
router.post('/', upload.single('logo'), createSupplier);
router.put('/:id', upload.single('logo'), updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router; 