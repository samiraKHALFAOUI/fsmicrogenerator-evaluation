const express = require("express");
const router = express.Router();
const authController = require("../controllers/authentication.controller");

router.all(/^\/(.*)$/, authController.redirectRequest)

module.exports = router;
