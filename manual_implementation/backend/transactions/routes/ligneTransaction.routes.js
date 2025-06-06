const express = require('express');
const router = express.Router();
const ligneTransactionController = require('../controllers/ligneTransaction.controller');

router.route('/')
     
  .post(ligneTransactionController.addManyLigneTransaction);   


module.exports = router;
