const express = require("express");
const router = express.Router();
const whitelistController = require("../controllers/whitelist.controller");
const validator = require("../validations/whitelist.validator");

const {
    validateBody,
} = require("../middlewares/bodyValidation.middleware");

router.route("/")
    .get(whitelistController.getAll)
    .post(validateBody(validator.schema), whitelistController.add);

router.route("/:type/:key")
    .get(whitelistController.getOne)
    .patch(validateBody(validator.schemaUpdate), whitelistController.update)
    .delete(whitelistController.delete);


module.exports = router;
