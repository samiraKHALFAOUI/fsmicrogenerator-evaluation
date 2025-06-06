const express = require("express");
const router = express.Router();
const taxonomyController = require("../controllers/taxonomy.controller");
const validator = require("../validations/taxonomy.validator");
const { uploadFile } = require("../helpers/helpers");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(taxonomyController.getAll)
  .post(
    uploadFile("/uploads/taxonomies", "single", { fileName: "logo" }),
    validateBody(validator.schema),
    taxonomyController.add
  )
  .patch(taxonomyController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), taxonomyController.addMany)
  .patch(taxonomyController.updateMany);

router
  .route("/translate/:id")
  .get(
    validateParam(schemas.idSchema, "id"),
    taxonomyController.getTranslations
  )
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    taxonomyController.translateData
  );
router.route("/one").get(taxonomyController.getOne);
router.route("/statistiques").post(taxonomyController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), taxonomyController.getById)
  .patch(
    uploadFile("/uploads/taxonomies", "single", { fileName: "logo" }),
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    taxonomyController.update)
  .delete(validateParam(schemas.idSchema, "id"), taxonomyController.delete);

module.exports = router;
