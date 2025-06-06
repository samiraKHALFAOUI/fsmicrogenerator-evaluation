const {
  joiObject,
  stringRequired,
  objectIdRequired
} = require("../middlewares/commonTypesValidation");
const authSchema = joiObject({
  login: stringRequired("login"),
  password: stringRequired("password")
});

const logOutSchema = joiObject({
  user: objectIdRequired("userId"),
  motif: stringRequired("motif")
});

module.exports = {
  schema: authSchema,
  logOutSchema
};
