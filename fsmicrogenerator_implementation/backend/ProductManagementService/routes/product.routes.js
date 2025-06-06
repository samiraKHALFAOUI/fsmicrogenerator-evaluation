const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const validator = require("../validations/product.validator");
const { uploadFile } = require("../helpers/helpers");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(productController.getAll)
  .post(
    uploadFile("/uploads/product", "single", { fileName: "image" }),
    validateBody(validator.schema),
    productController.add
  )
  .patch(productController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), productController.addMany)
  .patch(productController.updateMany);

router
  .route("/translate/:id")
  .get(validateParam(schemas.idSchema, "id"), productController.getTranslations)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.translateSchema),
    ],
    productController.translateData
  );
router.route("/one").get(productController.getOne);
router.route("/statistiques").post(productController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), productController.getById)
  .patch(
    uploadFile("/uploads/product", "single", { fileName: "image" }),
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    productController.update).delete(validateParam(schemas.idSchema, "id"), productController.delete);

module.exports = router;
