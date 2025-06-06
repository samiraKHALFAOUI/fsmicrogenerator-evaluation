const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplier.controller");
const validator = require("../validations/supplier.validator");
const { uploadFile } = require("../helpers/helpers");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(supplierController.getAll)
  .post(
    uploadFile("/uploads/supplier", "single", { fileName: "logo" }),
    validateBody(validator.schema),
    supplierController.add
  )
  .patch(supplierController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), supplierController.addMany)
  .patch(supplierController.updateMany);

router
  .route("/translate/:id")
  .get(
    validateParam(schemas.idSchema, "id"),
    supplierController.getTranslations
  )
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    supplierController.translateData
  );
router.route("/one").get(supplierController.getOne);
router.route("/statistiques").post(supplierController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), supplierController.getById)
  .patch(
    uploadFile("/uploads/supplier", "single", { fileName: "logo" }),
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    supplierController.update)
  .delete(validateParam(schemas.idSchema, "id"), supplierController.delete);

module.exports = router;
