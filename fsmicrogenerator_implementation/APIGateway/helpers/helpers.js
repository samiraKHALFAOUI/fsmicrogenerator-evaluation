
const jwt = require("jsonwebtoken");

module.exports.jwtSign = (data, expiresIn = process.env.TOKEN_EXPIRATION_DURATION_IN_MILLISECOND) =>
  jwt.sign(data, process.env.TOKEN_KEY, expiresIn ? { expiresIn } : {}
  );
module.exports.jwtVerify = (token) => jwt.verify(token, process.env.TOKEN_KEY);
// #endregion
//#endregion jwt
//#region trace
