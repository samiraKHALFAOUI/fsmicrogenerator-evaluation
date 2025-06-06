const express = require("express");
const router = express.Router();
const currencyController = require("../controllers/currency.controller");
const validator = require("../validations/currency.validator");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(currencyController.getAll)
  .post(validateBody(validator.schema), currencyController.add)
  .patch(currencyController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), currencyController.addMany)
  .patch(currencyController.updateMany);

router.route("/one").get(currencyController.getOne);

router.route("/statistiques").post(currencyController.getStatistique);
router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), currencyController.getById)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    currencyController.update)
  .delete(validateParam(schemas.idSchema, "id"), currencyController.delete);

module.exports = router;
