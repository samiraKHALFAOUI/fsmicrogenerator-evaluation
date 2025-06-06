const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const validator = require("../validations/user.validator");
const { uploadFile } = require("../helpers/helpers");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(userController.getAll)
  .post(
    uploadFile("/uploads/user", "single", { fileName: "photo" }),
    validateBody(validator.schema),
    userController.add
  )
  .patch(userController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), userController.addMany)
  .patch(userController.updateMany);

router
  .route("/translate/:id")
  .get(validateParam(schemas.idSchema, "id"), userController.getTranslations)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    userController.translateData
  );
router.route("/one").get(userController.getOne);
router.route("/statistiques").post(userController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), userController.getById)
  .patch(
    uploadFile("/uploads/user", "single", { fileName: "photo" }),
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    userController.update)
  .delete(validateParam(schemas.idSchema, "id"), userController.delete);

module.exports = router;
