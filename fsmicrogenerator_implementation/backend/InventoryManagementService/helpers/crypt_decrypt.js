const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const token_key = (module.exports.token_key = "K1123128ybksx");
const crypt_key = (module.exports.crypt_key = "G2136G23I2");
const IV_LENGTH = 16;

let ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(String(crypt_key))
  .digest("base64")
  .substring(0, 32);

module.exports.encrypt = function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

module.exports.decrypt = function decrypt(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports.verifyToken = function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization;
  if (token === "null" || token === null) {
    return res.status(401).send("Unauthorized request");
  }
  let payload;
  try {
    payload = jwt.verify(token, token_key);
  } catch (error) {
    return res.status(401).send("Unauthorized request");
  }
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.userId = payload.subject;
  next();
};
