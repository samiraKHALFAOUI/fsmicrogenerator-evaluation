const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produit.controller");
const upload = require("../utils/fileUpload");

router
  .route("/")
  .get(produitController.getProducts)
  .post(upload.single('image'), produitController.add)


router
  .route("/:id")
  .get(produitController.getById)
  .delete(produitController.delete)
  .patch(upload.single('image'), produitController.update);

module.exports = router;