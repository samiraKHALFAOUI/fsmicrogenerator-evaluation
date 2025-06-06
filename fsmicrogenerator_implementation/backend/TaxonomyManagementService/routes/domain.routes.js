const express = require("express");
const router = express.Router();
const domainController = require("../controllers/domain.controller");
const validator = require("../validations/domain.validator");
const { uploadFile } = require("../helpers/helpers");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(domainController.getAll)
  .post(
    uploadFile("/uploads/domain", "single", { fileName: "logo" }),
    validateBody(validator.schema),
    domainController.add
  )
  .patch(domainController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), domainController.addMany)
  .patch(domainController.updateMany);

router
  .route("/translate/:id")
  .get(validateParam(schemas.idSchema, "id"), domainController.getTranslations)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    domainController.translateData
  );
router.route("/one").get(domainController.getOne);
router.route("/statistiques").post(domainController.getStatistique);
router.get("/domains", domainController.getDomainsByCode);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), domainController.getById)
  .patch(
    uploadFile("/uploads/domain", "single", { fileName: "logo" }),
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    domainController.update)
  .delete(validateParam(schemas.idSchema, "id"), domainController.delete);

module.exports = router;
