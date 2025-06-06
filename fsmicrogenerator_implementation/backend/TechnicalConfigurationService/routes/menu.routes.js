const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu.controller");
const validator = require("../validations/menu.validator");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(menuController.getAll)
  .post(validateBody(validator.schema), menuController.add)
  .patch(menuController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), menuController.addMany)
  .patch(menuController.updateMany);

router
  .route("/translate/:id")
  .get(validateParam(schemas.idSchema, "id"), menuController.getTranslations)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    menuController.translateData
  );

router.route("/one").get(menuController.getOne);

router.route("/statistiques").post(menuController.getStatistique);
router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), menuController.getById)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    menuController.update)
  .delete(validateParam(schemas.idSchema, "id"), menuController.delete);

module.exports = router;
