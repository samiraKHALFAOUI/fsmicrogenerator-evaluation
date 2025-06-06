const express = require("express");
const router = express.Router();
const proxyController = require("../controllers/proxy.controller");

router.all(/^\/([^/]+)\/(.*)$/, proxyController.redirectRequest)

module.exports = router;
