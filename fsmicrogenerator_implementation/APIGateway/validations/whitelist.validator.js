const {
  joiObject,
  stringRequired,
  numberRequired,
  number,
  joiObjectRequired,
} = require("../middlewares/commonTypesValidation");

const schema = joiObject({
  type: stringRequired("type").valid('ip', 'user'),
  key: stringRequired("key"),
  rateLimit: joiObjectRequired(
    {
      window: number("window"),
      limit: numberRequired("limit"),
    },
    "rateLimit"
  ),
});

const schemaUpdate = joiObject({
  rateLimit: joiObjectRequired(
    {
      window: number("window"),
      limit: numberRequired("limit"),
    },
    "rateLimit"
  ),
});

module.exports = {
  schema,
  schemaUpdate

};
