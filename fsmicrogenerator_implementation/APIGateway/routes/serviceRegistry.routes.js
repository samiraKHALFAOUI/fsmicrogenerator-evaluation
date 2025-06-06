const express = require("express");
const router = express.Router();
const serviceRegistryController = require("../controllers/serviceRegistry.controller");
const validator = require("../validations/serviceRegistry.validator");

const {
  validateBody,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/register")
  .post(validateBody(validator.schemaRegister), serviceRegistryController.register)

router
  .route("/unregister")
  .post(validateBody(validator.schemaUnRegister), serviceRegistryController.unregister)

router
  .route("/updateState")
  .post(validateBody(validator.schemaUpdateState), serviceRegistryController.updateState)


module.exports = router;
