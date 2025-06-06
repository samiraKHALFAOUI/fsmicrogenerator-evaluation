const express = require("express");
const router = express.Router();
const exchangeRateController = require("../controllers/exchangeRate.controller");
const validator = require("../validations/exchangeRate.validator");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(exchangeRateController.getAll)
  .post(validateBody(validator.schema), exchangeRateController.add)
  .patch(exchangeRateController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), exchangeRateController.addMany)
  .patch(exchangeRateController.updateMany);

router.route("/one").get(exchangeRateController.getOne);

router.route("/statistiques").post(exchangeRateController.getStatistique);
router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), exchangeRateController.getById)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    exchangeRateController.update)
  .delete(validateParam(schemas.idSchema, "id"), exchangeRateController.delete);

module.exports = router;
