const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const validator = require("../validations/customer.validator");
const { uploadFile } = require("../helpers/helpers");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(customerController.getAll)
  .post(
    uploadFile("/uploads/customer", "single", { fileName: "photo" }),
    validateBody(validator.schema),
    customerController.add
  )
  .patch(customerController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), customerController.addMany)
  .patch(customerController.updateMany);

router
  .route("/translate/:id")
  .get(
    validateParam(schemas.idSchema, "id"),
    customerController.getTranslations
  )
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    customerController.translateData
  );
router.route("/one").get(customerController.getOne);
router.route("/statistiques").post(customerController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), customerController.getById)
  .patch(
    uploadFile("/uploads/customer", "single", { fileName: "photo" }),
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    customerController.update)
  .delete(validateParam(schemas.idSchema, "id"), customerController.delete);

module.exports = router;
