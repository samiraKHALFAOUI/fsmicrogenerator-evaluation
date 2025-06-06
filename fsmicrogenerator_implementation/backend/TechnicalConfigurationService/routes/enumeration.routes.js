const express = require("express");
const router = express.Router();
const enumerationController = require("../controllers/enumeration.controller");
const validator = require("../validations/enumeration.validator");

const {
  validateBody,
  validateParam,
  schemas
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(enumerationController.getAll)
  .post(validateBody(validator.schema), enumerationController.add)
  .patch(enumerationController.updateState);

router.route("/load").get(enumerationController.loadEnumValues);

router
  .route("/generate")
  .get(enumerationController.generateEnumValues)
  .post(enumerationController.addMissingEnumerations);

router
  .route("/filter")
  .get(enumerationController.filterEnumValues)
  .post(enumerationController.deleteUnusedEnumeration);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), enumerationController.addMany)
  .patch(enumerationController.updateMany);

router
  .route("/translate/:id")
  .get(
    validateParam(schemas.idSchema, "id"),
    enumerationController.getTranslations
  )
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema)
    ],
    enumerationController.translateData
  );
router.route("/one").get(enumerationController.getOne);

router.route("/statistiques").post(enumerationController.getStatistique);
router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), enumerationController.getById)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema)
    ],
    enumerationController.update)
  .delete(validateParam(schemas.idSchema, "id"), enumerationController.delete);

module.exports = router;
