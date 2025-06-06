const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const validator = require("../validations/transaction.validator");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(transactionController.getAll)
  .post(validateBody(validator.schema), transactionController.add)
  .patch(transactionController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), transactionController.addMany)
  .patch(transactionController.updateMany);

router.route("/one").get(transactionController.getOne);
router.route("/statistiques").post(transactionController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), transactionController.getById)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    transactionController.update)
  .delete(validateParam(schemas.idSchema, "id"), transactionController.delete);

module.exports = router;
