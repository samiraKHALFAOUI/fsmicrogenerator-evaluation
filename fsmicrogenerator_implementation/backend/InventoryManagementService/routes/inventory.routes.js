const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const validator = require("../validations/inventory.validator");

const {
  validateBody,
  validateParam,
  schemas,
} = require("../middlewares/bodyValidation.middleware");

router
  .route("/")
  .get(inventoryController.getAll)
  .post(validateBody(validator.schema), inventoryController.add)
  .patch(inventoryController.updateState);

router
  .route("/many")
  .post(validateBody(validator.schemaMany), inventoryController.addMany)
  .patch(inventoryController.updateMany);

router.route("/one").get(inventoryController.getOne);
router.route("/statistiques").post(inventoryController.getStatistique);

router
  .route("/:id")
  .get(validateParam(schemas.idSchema, "id"), inventoryController.getById)
  .patch(
    [
      validateParam(schemas.idSchema, "id"),
      validateBody(validator.updateSchema),
    ],
    inventoryController.update)
  .delete(validateParam(schemas.idSchema, "id"), inventoryController.delete);

module.exports = router;
