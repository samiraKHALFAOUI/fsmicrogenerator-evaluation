const { jwtVerify } = require("../helpers/helpers.js");

module.exports.validateToken = (req, res, next) => (req, res, next) => {
  if (jwtVerify(req.headers[process.env.TOKEN_FIELD_NAME])) next();
  else res.status(401).send({ error: "Invalid token" });
};
