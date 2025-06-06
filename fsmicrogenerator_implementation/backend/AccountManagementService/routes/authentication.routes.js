const express = require("express");
const router = express.Router();
const authController = require("../controllers/authentication.controller");
const validator = require("../validations/authentication.validator");
const { validateBody } = require("../middlewares/bodyValidation.middleware");

router.route("/").post(validateBody(validator.schema), authController.login);

router.route("/token").get(authController.regenerateToken);

router.route("/send-verification-email").get(authController.getOne);

router
  .route("/logout")
  .post(validateBody(validator.logOutSchema), authController.logout);

module.exports = router;
