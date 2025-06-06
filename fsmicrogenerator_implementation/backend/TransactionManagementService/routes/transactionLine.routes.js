const express = require("express");
const router = express.Router();
const transactionLineController = require("../controllers/transactionLine.controller");
const validator = require("../validations/transactionLine.validator");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(transactionLineController.getAll)
  .post(validateBody(validator.schema), transactionLineController.add)
  .patch(transactionLineController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), transactionLineController.addMany)
  .patch(transactionLineController.updateMany);

router.route("/one").get(transactionLineController.getOne);
router.route("/statistiques").post(transactionLineController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), transactionLineController.getById)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    transactionLineController.update)
  .delete(
    validateParam(schemas.idSchema, "id"),
    transactionLineController.delete
  );

module.exports = router;
