const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const validator = require("../validations/category.validator");
const { uploadFile } = require("../helpers/helpers");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(categoryController.getAll)
  .post(
    uploadFile("/uploads/category", "single", { fileName: "icon" }),
    validateBody(validator.schema),
    categoryController.add
  )
  .patch(categoryController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), categoryController.addMany)
  .patch(categoryController.updateMany);

router
  .route("/translate/:id")
  .get(
    validateParam(schemas.idSchema, "id"),
    categoryController.getTranslations
  )
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    categoryController.translateData
  );
router.route("/one").get(categoryController.getOne);
router.route("/statistiques").post(categoryController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), categoryController.getById)
  .patch(
    uploadFile("/uploads/category", "single", { fileName: "icon" }),
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    categoryController.update)
  .delete(validateParam(schemas.idSchema, "id"), categoryController.delete);

module.exports = router;
