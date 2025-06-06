const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.route('/')
  .get(transactionController.getTransaction)   
  .post(transactionController.addTransaction);   

router.route('/:id')
  .get(transactionController.getTransactionById)     
  .patch(transactionController.updateTransactionById)    
  .delete(transactionController.deleteTransactionById); 

module.exports = router;
