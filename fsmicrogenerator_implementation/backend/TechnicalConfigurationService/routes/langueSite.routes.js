const express = require("express");
const router = express.Router();
const langueSiteController = require("../controllers/langueSite.controller");
const validator = require("../validations/langueSite.validator");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(langueSiteController.getAll)
  .post(validateBody(validator.schema), langueSiteController.add)
  .patch(langueSiteController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), langueSiteController.addMany)
  .patch(langueSiteController.updateMany);

router
  .route("/translate/:id")
  .get(
    validateParam(schemas.idSchema, "id"),
    langueSiteController.getTranslations
  )
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    langueSiteController.translateData
  );
router.route("/setOrdre").patch(langueSiteController.updateOrdre);

router.route("/one").get(langueSiteController.getOne);

router.route("/statistiques").post(langueSiteController.getStatistique);
router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), langueSiteController.getById)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    langueSiteController.update)
  .delete(validateParam(schemas.idSchema, "id"), langueSiteController.delete);

module.exports = router;
