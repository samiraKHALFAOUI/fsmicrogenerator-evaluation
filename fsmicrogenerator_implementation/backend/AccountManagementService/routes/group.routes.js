const express = require("express");
const router = express.Router();
const groupController = require("../controllers/group.controller");
const validator = require("../validations/group.validator");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(groupController.getAll)
  .post(validateBody(validator.schema), groupController.add)
  .patch(groupController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), groupController.addMany)
  .patch(groupController.updateMany);

router
  .route("/translate/:id")
  .get(validateParam(schemas.idSchema, "id"), groupController.getTranslations)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    groupController.translateData
  );
router.route("/one").get(groupController.getOne);
router.route("/statistiques").post(groupController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), groupController.getById)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    groupController.update)
  .delete(validateParam(schemas.idSchema, "id"), groupController.delete);

module.exports = router;
